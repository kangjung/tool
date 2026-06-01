const htmlMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

const reverseHtmlMap = Object.fromEntries(Object.entries(htmlMap).map(([key, value]) => [value, key]));

export const encodeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => htmlMap[char]);

export const decodeHtml = (value: string) =>
  value.replace(/&(amp|lt|gt|quot|#39);/g, (entity) => reverseHtmlMap[entity] ?? entity);

export const encodeUrl = (value: string) => encodeURIComponent(value);

export const decodeUrl = (value: string) => decodeURIComponent(value);

export const parseQueryString = (value: string) => {
  const query = value.includes('?') ? value.split('?').slice(1).join('?') : value;
  const cleanQuery = query.split('#')[0].replace(/^\?/, '');
  if (!cleanQuery) {
    return '';
  }

  const params = new URLSearchParams(cleanQuery);
  return Array.from(params.entries())
    .map(([key, paramValue]) => `${key}: ${paramValue}`)
    .join('\n');
};
