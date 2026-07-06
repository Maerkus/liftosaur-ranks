import { ILogUtil } from "./log";
import { IGoogleServiceAccountPubsub, ISecretsUtil } from "./secrets";

// Self-hosted replacement for AWS Secrets Manager. Only the secrets the login+sync
// feature set needs are required; payment/AI/push secrets return "" so their routes
// fail per-request instead of crashing the server.
export class EnvSecretsUtil implements ISecretsUtil {
  constructor(public readonly log: ILogUtil) {}

  private require(name: string): Promise<string> {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Missing required env var ${name} (set it in your .env for the self-hosted server)`);
    }
    return Promise.resolve(value);
  }

  public getCookieSecret(): Promise<string> {
    return this.require("LFT_COOKIE_SECRET");
  }

  public getCryptoKey(): Promise<string> {
    return this.require("LFT_CRYPTO_KEY");
  }

  public getApiKey(): Promise<string> {
    return this.require("LFT_API_KEY");
  }

  public async getWebpushrKey(): Promise<string> {
    return "";
  }

  public async getWebpushrAuthToken(): Promise<string> {
    return "";
  }

  public async getAppleAppSharedSecret(): Promise<string> {
    return "";
  }

  public async getApplePrivateKey(): Promise<string> {
    return "";
  }

  public async getAppleKeyId(): Promise<string> {
    return "";
  }

  public async getAppleIssuerId(): Promise<string> {
    return "";
  }

  public async getGoogleServiceAccountPubsub(): Promise<IGoogleServiceAccountPubsub> {
    throw new Error("Google Play integration is not available in the self-hosted build");
  }

  public async getOpenAiKey(): Promise<string> {
    return process.env.LFT_OPENAI_KEY || "";
  }

  public async getAnthropicKey(): Promise<string> {
    return process.env.LFT_ANTHROPIC_KEY || "";
  }

  public async getApplePromotionalOfferKeyId(): Promise<string> {
    return "";
  }

  public async getApplePromotionalOfferPrivateKey(): Promise<string> {
    return "";
  }

  public async getUpdatesPrivateKey(): Promise<string> {
    return "";
  }
}
