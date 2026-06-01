const bytesToBinary = (bytes: Uint8Array) => Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');

const binaryToBytes = (binary: string) => Uint8Array.from(binary, (char) => char.charCodeAt(0));

const normalizeUrlSafe = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  return padding ? base64 + '='.repeat(4 - padding) : base64;
};

export const encodeBase64 = (value: string) => btoa(bytesToBinary(new TextEncoder().encode(value)));

export const decodeBase64 = (value: string) => new TextDecoder().decode(binaryToBytes(atob(value.trim())));

export const encodeUrlSafeBase64 = (value: string) => encodeBase64(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

export const decodeUrlSafeBase64 = (value: string) => decodeBase64(normalizeUrlSafe(value.trim()));
