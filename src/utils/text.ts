export type TextStats = {
  chars: number;
  charsNoSpaces: number;
  lines: number;
  bytes: number;
};

export const countText = (value: string): TextStats => ({
  chars: Array.from(value).length,
  charsNoSpaces: Array.from(value.replace(/\s/g, '')).length,
  lines: value.length === 0 ? 0 : value.split(/\r\n|\r|\n/).length,
  bytes: new TextEncoder().encode(value).byteLength
});
