const bytesToBinary = (bytes: Uint8Array) => Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');

const binaryToBytes = (binary: string) => Uint8Array.from(binary, (char) => char.charCodeAt(0));

const utf8Decoder = new TextDecoder('utf-8', { fatal: true });

const normalizeUrlSafe = (value: string) => {
  const base64 = value.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  return padding ? base64 + '='.repeat(4 - padding) : base64;
};

export const encodeBase64 = (value: string) => btoa(bytesToBinary(new TextEncoder().encode(value)));

export const decodeBase64 = (value: string) => {
  try {
    return utf8Decoder.decode(binaryToBytes(atob(normalizeUrlSafe(value))));
  } catch {
    throw new Error('UTF-8 텍스트 Base64만 디코딩할 수 있습니다. 파일/이미지 Base64이거나 잘못된 문자열이면 글자가 깨질 수 있습니다.');
  }
};

export const encodeUrlSafeBase64 = (value: string) => encodeBase64(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

export const decodeUrlSafeBase64 = (value: string) => decodeBase64(normalizeUrlSafe(value.trim()));
