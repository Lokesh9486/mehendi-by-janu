import {
  constants,
  createHash,
  generateKeyPairSync,
  privateDecrypt,
  type KeyObject,
} from "node:crypto";

/**
 * Credentials never travel in plain text.
 *
 * The browser asks for a short-lived public key, encrypts the JSON payload with
 * RSA-OAEP (SHA-256) and posts only the ciphertext. The matching private key
 * stays in this server process.
 *
 * Note: TLS is still the transport that actually protects the connection; this
 * layer keeps the email/password out of readable payloads, logs, and dev tooling.
 */

export type SecureEnvelope = {
  keyId?: unknown;
  payload?: unknown;
};

type SecureChannel = {
  keyId: string;
  publicKeyJwk: JsonWebKey;
  privateKey: KeyObject;
};

const globalForChannel = globalThis as typeof globalThis & {
  __mehandiSecureChannel?: SecureChannel;
};

export class SecurePayloadError extends Error {
  code: "invalid_envelope" | "stale_key" | "undecryptable";

  constructor(code: SecurePayloadError["code"], message: string) {
    super(message);
    this.name = "SecurePayloadError";
    this.code = code;
  }
}

function getChannel(): SecureChannel {
  if (globalForChannel.__mehandiSecureChannel) {
    return globalForChannel.__mehandiSecureChannel;
  }

  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  const keyId = createHash("sha256")
    .update(publicKey.export({ type: "spki", format: "der" }))
    .digest("hex")
    .slice(0, 32);

  const channel: SecureChannel = {
    keyId,
    publicKeyJwk: publicKey.export({ format: "jwk" }),
    privateKey,
  };

  globalForChannel.__mehandiSecureChannel = channel;
  return channel;
}

export function getSecureHandshake() {
  const channel = getChannel();

  return {
    keyId: channel.keyId,
    algorithm: "RSA-OAEP-256",
    publicKey: channel.publicKeyJwk,
  };
}

export function decryptSecureEnvelope(
  envelope: SecureEnvelope | null,
): Record<string, unknown> {
  if (!envelope || typeof envelope !== "object") {
    throw new SecurePayloadError(
      "invalid_envelope",
      "The request payload is missing.",
    );
  }

  const { keyId, payload } = envelope;

  if (typeof keyId !== "string" || typeof payload !== "string") {
    throw new SecurePayloadError(
      "invalid_envelope",
      "The request payload is not encrypted correctly.",
    );
  }

  const channel = getChannel();

  if (keyId !== channel.keyId) {
    throw new SecurePayloadError(
      "stale_key",
      "The secure session key expired. Please try again.",
    );
  }

  try {
    const decrypted = privateDecrypt(
      {
        key: channel.privateKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(payload, "base64"),
    );

    const parsed: unknown = JSON.parse(decrypted.toString("utf8"));

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Payload is not an object.");
    }

    return parsed as Record<string, unknown>;
  } catch {
    throw new SecurePayloadError(
      "undecryptable",
      "The encrypted payload could not be read. Please try again.",
    );
  }
}
