export type ToolId = 'base64' | 'sha256' | 'json' | 'url' | 'html' | 'uuid' | 'text';

export type ToolMeta = {
  id: ToolId;
  title: string;
  shortTitle: string;
  path: string;
  category: 'Encoding' | 'Crypto' | 'Format' | 'Generator' | 'Text';
  summary: string;
  description: string;
  keywords: string[];
  example: string;
  caution: string;
  sensitive?: boolean;
};

export const tools: ToolMeta[] = [
  {
    id: 'base64',
    title: 'Base64 Encode Decode',
    shortTitle: 'Base64',
    path: '/base64/',
    category: 'Encoding',
    summary: 'UTF-8 문자열을 Base64와 URL Safe Base64로 변환합니다.',
    description: '한글, 이모지, 특수문자를 포함한 UTF-8 문자열을 Base64로 인코딩하거나 디코딩합니다.',
    keywords: ['base64 인코더', 'base64 디코더', 'base64 url safe', 'encode', 'decode'],
    example: '안녕하세요 DevBox 👋',
    caution: '디코딩할 문자열은 UTF-8 텍스트로 만들어진 Base64여야 합니다. 이미지나 파일 Base64는 글자가 깨져 보일 수 있습니다.'
  },
  {
    id: 'sha256',
    title: 'SHA-256 해시 생성기',
    shortTitle: 'SHA-256',
    path: '/sha256/',
    category: 'Crypto',
    summary: 'Web Crypto API로 문자열 SHA-256 해시를 생성합니다.',
    description: '문자열을 SHA-256 해시로 변환합니다. SHA-256은 복호화할 수 없는 단방향 해시입니다.',
    keywords: ['sha256 생성기', 'sha256 해시', 'sha256 암호화', 'hash'],
    example: 'hello',
    caution: 'SHA-256은 복호화할 수 없는 단방향 해시입니다.',
    sensitive: true
  },
  {
    id: 'json',
    title: 'JSON Formatter',
    shortTitle: 'JSON',
    path: '/json/',
    category: 'Format',
    summary: 'JSON 정렬, 압축, 유효성 검사를 빠르게 처리합니다.',
    description: 'JSON Pretty Print, Minify, Validate를 한 화면에서 처리하고 오류 메시지를 확인합니다.',
    keywords: ['json formatter', 'json pretty print', 'json 정렬', 'json 압축'],
    example: '{"name":"DevBox","tools":["json","base64"],"active":true}',
    caution: 'JSON 문법이 올바르지 않으면 브라우저가 반환하는 파싱 오류를 표시합니다.'
  },
  {
    id: 'url',
    title: 'URL Encode Decode',
    shortTitle: 'URL',
    path: '/url/',
    category: 'Encoding',
    summary: 'URL 문자열을 인코딩하거나 디코딩합니다.',
    description: 'URL Encode, URL Decode와 query string 확인을 브라우저 안에서 처리합니다.',
    keywords: ['url 인코더', 'url 디코더', 'url encode decode', 'query string'],
    example: 'https://example.com/search?q=개발 도구&sort=latest',
    caution: '잘못 이스케이프된 문자열은 디코딩 중 오류가 날 수 있습니다.'
  },
  {
    id: 'html',
    title: 'HTML Entity Encode Decode',
    shortTitle: 'HTML Entity',
    path: '/html/',
    category: 'Encoding',
    summary: 'HTML 특수문자를 엔티티로 변환하거나 되돌립니다.',
    description: '<, >, &, 큰따옴표, 작은따옴표 같은 HTML 특수문자를 안전하게 변환합니다.',
    keywords: ['html 인코더', 'html entity 변환', 'html escape'],
    example: '<button class="save">저장 & 닫기</button>',
    caution: '이 도구는 기본 HTML 특수문자 변환에 집중합니다.'
  },
  {
    id: 'uuid',
    title: 'UUID v4 Generator',
    shortTitle: 'UUID',
    path: '/uuid/',
    category: 'Generator',
    summary: 'UUID v4를 한 개 또는 여러 개 생성합니다.',
    description: 'crypto.randomUUID를 사용해 UUID v4를 생성하고 한 번에 복사할 수 있습니다.',
    keywords: ['uuid 생성기', 'uuid v4 generator', 'random uuid'],
    example: '5',
    caution: '생성한 UUID는 브라우저에서만 만들어지며 서버에 저장되지 않습니다.'
  },
  {
    id: 'text',
    title: 'Text Counter',
    shortTitle: 'Text',
    path: '/text/',
    category: 'Text',
    summary: '글자 수, 공백 제외 글자 수, 줄 수, UTF-8 바이트를 계산합니다.',
    description: '문자열을 분석해 전체 글자 수, 공백 제외 글자 수, 줄 수, UTF-8 바이트를 보여줍니다.',
    keywords: ['문자열 카운터', '글자 수', 'utf-8 byte', 'text counter'],
    example: '첫 번째 줄\n두 번째 줄 with spaces',
    caution: '줄 수는 입력이 비어 있으면 0으로 계산합니다.'
  }
];

export const categories = ['All', 'Encoding', 'Crypto', 'Format', 'Generator', 'Text'] as const;

export const privacyNotice = '입력한 데이터는 서버로 전송되지 않으며 브라우저 안에서만 처리됩니다.';
export const sensitiveNotice = '실제 운영 토큰, 비밀번호, 개인정보 등 민감한 데이터는 온라인 도구에 입력하지 않는 것을 권장합니다.';

export const getToolByPath = (path: string): ToolMeta | undefined => {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  return tools.find((tool) => tool.path === normalized);
};
