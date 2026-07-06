import * as fs from "fs/promises";
import * as path from "path";
import { Readable } from "stream";
import { ILogUtil } from "./log";
import { IS3Util } from "./s3";

// Self-hosted replacement for S3: objects are plain files under LFT_DATA_DIR/<bucket>/<key>.
// Storage snapshots and program revisions are written un-caught inside the sync path, so this
// must be reliable - everything else (debug, caches, exceptions) just piggybacks on it.
export class S3FsUtil implements IS3Util {
  constructor(public readonly log: ILogUtil) {}

  private root(): string {
    const dir = process.env.LFT_DATA_DIR;
    if (!dir) {
      throw new Error("Missing required env var LFT_DATA_DIR (directory for file-based object storage)");
    }
    return dir;
  }

  private objectPath(bucket: string, key: string): string {
    const resolved = path.resolve(this.root(), bucket, key);
    // keys come from user input in some routes - never allow escaping the data dir
    if (!resolved.startsWith(path.resolve(this.root()) + path.sep)) {
      throw new Error(`Invalid object key: ${bucket}/${key}`);
    }
    return resolved;
  }

  public async listObjects(args: { bucket: string; prefix: string }): Promise<string[]> {
    const bucketDir = path.resolve(this.root(), args.bucket);
    const result: string[] = [];
    const walk = async (dir: string): Promise<void> => {
      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          return;
        }
        throw error;
      }
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(full);
        } else {
          const key = path.relative(bucketDir, full).split(path.sep).join("/");
          if (key.startsWith(args.prefix)) {
            result.push(key);
          }
        }
      }
    };
    await walk(bucketDir);
    this.log.log("S3fs list objects:", `${args.bucket}/${args.prefix} - ${result.length}`);
    return result.sort();
  }

  public async getObject(args: { bucket: string; key: string }): Promise<Buffer | undefined> {
    try {
      const result = await fs.readFile(this.objectPath(args.bucket, args.key));
      this.log.log("S3fs get:", `${args.bucket}/${args.key}`);
      return result;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        this.log.log("S3fs get (missing):", `${args.bucket}/${args.key}`);
        return undefined;
      }
      throw error;
    }
  }

  public async putObject(args: {
    bucket: string;
    key: string;
    body: string | Buffer | Uint8Array | Readable;
    opts?: { acl?: string; contentType?: string };
  }): Promise<void> {
    const file = this.objectPath(args.bucket, args.key);
    await fs.mkdir(path.dirname(file), { recursive: true });
    let body = args.body;
    if (body instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of body) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      body = Buffer.concat(chunks);
    }
    await fs.writeFile(file, body);
    this.log.log("S3fs put:", `${args.bucket}/${args.key}`);
  }

  public async deleteObject(args: { bucket: string; key: string }): Promise<void> {
    try {
      await fs.unlink(this.objectPath(args.bucket, args.key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
    this.log.log("S3fs delete:", `${args.bucket}/${args.key}`);
  }

  public async getPresignedUploadUrl(args: {
    bucket: string;
    key: string;
    contentType: string;
    expiresIn?: number;
  }): Promise<string> {
    // No presigned uploads without S3 - the user-image upload flow degrades gracefully
    this.log.log("S3fs presigned upload not supported:", `${args.bucket}/${args.key}`);
    return "";
  }

  public async getPresignedDownloadUrl(args: { bucket: string; key: string; expiresIn?: number }): Promise<string> {
    this.log.log("S3fs presigned download not supported:", `${args.bucket}/${args.key}`);
    return "";
  }
}
