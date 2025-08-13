// Shared crypto lib (libsodium wrappers)
import * as sodium from 'libsodium-wrappers';

export async function encrypt(secret: string, data: string): Promise<string> {
  await sodium.ready;
  const key = sodium.crypto_generichash(sodium.crypto_secretbox_KEYBYTES, secret);
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const cipher = sodium.crypto_secretbox_easy(data, nonce, key);
  // Concatenate nonce and cipher for storage/transmission
  const combined = new Uint8Array(nonce.length + cipher.length);
  combined.set(nonce);
  combined.set(cipher, nonce.length);
  return sodium.to_base64(combined);
}

export async function decrypt(secret: string, payload: string): Promise<string> {
  await sodium.ready;
  const combined = sodium.from_base64(payload);
  const nonce = combined.slice(0, sodium.crypto_secretbox_NONCEBYTES);
  const cipher = combined.slice(sodium.crypto_secretbox_NONCEBYTES);
  const key = sodium.crypto_generichash(sodium.crypto_secretbox_KEYBYTES, secret);
  const msg = sodium.crypto_secretbox_open_easy(cipher, nonce, key);
  if (!msg) throw new Error('Decryption failed');
  return sodium.to_string(msg);
}
