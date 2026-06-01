export const parseJson = (value: string) => JSON.parse(value) as unknown;

export const prettyJson = (value: string) => JSON.stringify(parseJson(value), null, 2);

export const minifyJson = (value: string) => JSON.stringify(parseJson(value));
