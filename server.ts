/* eslint-disable @typescript-eslint/no-explicit-any */
// Self-hosted production server: runs the whole lambda router as a plain HTTP Node server.
// TLS is terminated by whatever sits in front (Caddy, Tailscale Serve, Cloudflare Tunnel).
// Adapted from devserver.ts, minus dev TLS certs, git lookups, and the streaming (AI) server.
import http from "http";
import { getHandler } from "./lambda/index";
import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders, APIGatewayProxyResult } from "aws-lambda";
import { URL } from "url";
import { buildDi } from "./lambda/utils/di";
import { LogUtil } from "./lambda/utils/log";
import fetch from "node-fetch";

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Global {
      __COMMIT_HASH__: string;
      __FULL_COMMIT_HASH__: string;
      awslambda: any;
    }
  }
}

(global as any).awslambda = {
  streamifyResponse: (handler: Function) => {
    return handler;
  },
};

const commitHash = process.env.COMMIT_HASH || "selfhost";
(global as any).__COMMIT_HASH__ = commitHash;
(global as any).__FULL_COMMIT_HASH__ = process.env.FULL_COMMIT_HASH || commitHash;
process.env.COMMIT_HASH = commitHash;
process.env.FULL_COMMIT_HASH = (global as any).__FULL_COMMIT_HASH__;

const requiredEnv = ["SELFHOST", "LFT_COOKIE_SECRET", "LFT_API_KEY", "LFT_CRYPTO_KEY", "LFT_DATA_DIR", "HOST"];
const missing = requiredEnv.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}. See .env.selfhost.example.`);
  process.exit(1);
}

function getBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
  });
}

async function requestToProxyEvent(request: http.IncomingMessage): Promise<APIGatewayProxyEvent> {
  const body = await getBody(request);
  const url = new URL(request.url || "", "http://www.example.com");

  const qs: Partial<Record<string, string>> = {};
  url.searchParams.forEach((v, k) => {
    qs[k] = v;
  });
  const headers = { ...request.headers } as APIGatewayProxyEventHeaders;
  const cookieHeader = headers.cookie || "";
  headers["x-auth-state"] = cookieHeader.includes("session") ? "yes" : "no";
  const ua = headers["user-agent"] || "";
  headers["x-device-type"] = /iPhone|iPad|iPod/i.test(ua) ? "ios" : /Android/i.test(ua) ? "android" : "desktop";

  return {
    body: body,
    headers,
    multiValueHeaders: {},
    httpMethod: request.method || "GET",
    isBase64Encoded: false,
    path: url.pathname,
    pathParameters: {},
    queryStringParameters: qs,
    multiValueQueryStringParameters: {},
    stageVariables: {},

    requestContext: {} as any,
    resource: "",
  };
}

const handler = getHandler(() => buildDi(new LogUtil(), fetch));

const server = http.createServer(async (req, res) => {
  try {
    const result = (await handler(
      await requestToProxyEvent(req),
      { getRemainingTimeInMillis: () => 10000 },
      () => undefined
    )) as APIGatewayProxyResult;
    const body = result.isBase64Encoded ? Buffer.from(result.body, "base64") : result.body;
    res.statusCode = result.statusCode;
    for (const k of Object.keys(result.headers || {})) {
      res.setHeader(k, result.headers![k] as string);
    }
    res.end(body);
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ name: e.name, error: e.message }));
    } else {
      throw e;
    }
  }
});

const port = parseInt(process.env.PORT || "3000", 10);
server.listen(port, "0.0.0.0", () => {
  console.log(`--------- Liftosaur self-hosted API server is running on port ${port} ----------`);
});
