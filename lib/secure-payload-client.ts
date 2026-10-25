/**
 * Browser-side half of the encrypted payload channel.
 * Only the public key is ever fetched from the server.
 */

type Handshake = {
  keyId: string;
  algorithm: string;
  publicKey: JsonWebKey;
};

function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

async function encryptEnvelope(data: unknown) {
  const handshakeResponse = await fetch("/api/admin/handshake", {
    cache: "no-store",
  });

  if (!handshakeResponse.ok) {
    throw new Error("Unable to open a secure channel with the server.");
  }

  const handshake = (await handshakeResponse.json()) as Handshake;

  const key = await crypto.subtle.importKey(
    "jwk",
    handshake.publicKey,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );

  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    plaintext,
  );

  return {
    keyId: handshake.keyId,
    payload: toBase64(ciphertext),
  };
}

/**
 * Encrypts `data` and POSTs it to `url`.
 * If the server process restarted between the handshake and the request, the
 * key id no longer matches (428) and the call is retried once with a new key.
 */
export async function postEncryptedJson(url: string, data: unknown) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const envelope = await encryptEnvelope(data);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(envelope),
      cache: "no-store",
    });

    if (response.status === 428 && attempt === 0) continue;

    return response;
  }

  throw new Error("The secure channel could not be established.");
}
