const bytesToBinary = (bytes: Uint8Array) => Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');

const binaryToBytes = (binary: string) => Uint8Array.from(binary, (char) => char.charCodeAt(0));

const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
const invalidBase64Message =
  '\uC774 \uAC12\uC740 Base64\uB85C \uB514\uCF54\uB529\uD560 \uC218 \uC5C6\uC5B4\uC694. ' +
  'Base64\uB294 A-Z, a-z, 0-9, +, /, = \uBB38\uC790\uB9CC \uC0AC\uC6A9\uD574\uC694. ' +
  'URL Safe Base64\uB77C\uBA74 -, _\uB3C4 \uD5C8\uC6A9\uB429\uB2C8\uB2E4. ' +
  '\uC77C\uBC18 \uD55C\uAE00 \uBB38\uC7A5\uC744 \uB123\uC740 \uAC70\uB77C\uBA74 Decode\uAC00 \uC544\uB2C8\uB77C Encode\uB97C \uB20C\uB7EC\uC8FC\uC138\uC694.';
const invalidUtf8Message =
  'Base64\uB294 \uB9DE\uC9C0\uB9CC UTF-8 \uD14D\uC2A4\uD2B8\uB85C \uC77D\uC744 \uC218 \uC5C6\uC5B4\uC694. ' +
  '\uC774\uBBF8\uC9C0, \uD30C\uC77C, \uC555\uCD95 \uB370\uC774\uD130 \uAC19\uC740 \uBC14\uC774\uB108\uB9AC Base64\uC77C \uC218 \uC788\uC2B5\uB2C8\uB2E4.';

const normalizeUrlSafe = (value: string) => {
  const base64 = value.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  return padding ? base64 + '='.repeat(4 - padding) : base64;
};

const isValidBase64 = (value: string) => /^[A-Za-z0-9+/]*={0,2}$/.test(value) && value.length % 4 !== 1;

export const encodeBase64 = (value: string) => btoa(bytesToBinary(new TextEncoder().encode(value)));

export const decodeBase64 = (value: string) => {
  const normalized = normalizeUrlSafe(value);

  if (!normalized) {
    return '';
  }

  if (!isValidBase64(normalized)) {
    throw new Error(invalidBase64Message);
  }

  try {
    return utf8Decoder.decode(binaryToBytes(atob(normalized)));
  } catch {
    throw new Error(invalidUtf8Message);
  }
};

export const encodeUrlSafeBase64 = (value: string) => encodeBase64(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

export const decodeUrlSafeBase64 = (value: string) => decodeBase64(normalizeUrlSafe(value));
