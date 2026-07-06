import { SendEmailCommandOutput } from "@aws-sdk/client-ses";
import { ICloudwatchUtil } from "./cloudwatch";
import { ILambdaUtil } from "./lambda";
import { ILogUtil } from "./log";
import { ISesUtil } from "./ses";

// Self-hosted no-ops for AWS services the personal deployment doesn't need:
// email sending, cross-lambda invocation (stats/reconcile crons), and CloudWatch log retrieval.

export class SesNoopUtil implements ISesUtil {
  constructor(public readonly log: ILogUtil) {}

  public async sendEmail(args: {
    destination: string;
    source: string;
    subject: string;
    body: string;
  }): Promise<SendEmailCommandOutput | undefined> {
    this.log.log("Email sending disabled (self-hosted), skipping:", args.subject, "->", args.destination);
    return undefined;
  }
}

export class LambdaNoopUtil implements ILambdaUtil {
  constructor(private readonly log: ILogUtil) {}

  public async invoke<T>(args: {
    name: string;
    invocationType: "RequestResponse" | "Event";
    payload: T;
  }): Promise<void> {
    this.log.log("Lambda invoke disabled (self-hosted), skipping:", args.name);
  }
}

export class CloudwatchNoopUtil implements ICloudwatchUtil {
  constructor(private readonly log: ILogUtil) {}

  public async getLogs(): Promise<void> {
    this.log.log("CloudWatch logs disabled (self-hosted)");
  }
}
