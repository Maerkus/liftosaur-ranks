import { DynamoUtil, IDynamoUtil } from "./dynamo";
import { ILogUtil } from "./log";
import { ISecretsUtil, SecretsUtil } from "./secrets";
import { IS3Util, S3Util } from "./s3";
import { ISesUtil, SesUtil } from "./ses";
import { ILambdaUtil, LambdaUtil } from "./lambda";
import { CloudwatchUtil, ICloudwatchUtil } from "./cloudwatch";
import { EnvSecretsUtil } from "./secretsEnv";
import { S3FsUtil } from "./s3Fs";
import { CloudwatchNoopUtil, LambdaNoopUtil, SesNoopUtil } from "./awsNoop";

export interface IDI {
  dynamo: IDynamoUtil;
  log: ILogUtil;
  s3: IS3Util;
  ses: ISesUtil;
  secrets: ISecretsUtil;
  lambda: ILambdaUtil;
  cloudwatch: ICloudwatchUtil;
  fetch: Window["fetch"];
}

export function buildDi(log: ILogUtil, fetch: Window["fetch"]): IDI {
  // SELFHOST=true swaps every AWS dependency for env/filesystem/no-op implementations,
  // so the whole backend runs with just DynamoDB Local (see DYNAMODB_ENDPOINT in dynamo.ts).
  if (process.env.SELFHOST === "true") {
    return {
      dynamo: new DynamoUtil(log),
      secrets: new EnvSecretsUtil(log),
      s3: new S3FsUtil(log),
      ses: new SesNoopUtil(log),
      lambda: new LambdaNoopUtil(log),
      cloudwatch: new CloudwatchNoopUtil(log),
      log: log,
      fetch,
    };
  }
  return {
    dynamo: new DynamoUtil(log),
    secrets: new SecretsUtil(log),
    s3: new S3Util(log),
    ses: new SesUtil(log),
    lambda: new LambdaUtil(log),
    cloudwatch: new CloudwatchUtil(log),
    log: log,
    fetch,
  };
}
