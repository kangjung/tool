import './styles/main.css';
import { categories, getToolByPath, privacyNotice, sensitiveNotice, ToolId, tools, ToolMeta } from './data/tools';
import { copyText } from './utils/clipboard';
import { decodeBase64, decodeUrlSafeBase64, encodeBase64, encodeUrlSafeBase64 } from './utils/base64';
import { sha256 } from './utils/crypto';
import { decodeHtml, decodeUrl, encodeHtml, encodeUrl, parseQueryString } from './utils/encoder';
import { minifyJson, prettyJson } from './utils/json';
import { countText } from './utils/text';

const app = document.querySelector<HTMLDivElement>('#app');
const adsenseClient = 'ca-pub-2007216448786117';
const adsenseMainBottomSlot = '1636030778';
const basePath = import.meta.env.BASE_URL;
const basePrefix = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;

const toRoutePath = (path: string) => {
  if (basePrefix && basePrefix !== '/' && path.startsWith(basePrefix)) {
    return path.slice(basePrefix.length) || '/';
  }

  return path;
};

const withBase = (path: string) => {
  if (!basePrefix || basePrefix === '/') {
    return path;
  }

  return `${basePrefix}${path}`;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type State = {
  input: string;
  output: string;
  status: string;
  error: string;
  uuidCount: number;
};

const state: State = {
  input: '',
  output: '',
  status: '',
  error: '',
  uuidCount: 5
};

const routeTool = getToolByPath(toRoutePath(window.location.pathname));

const setTitle = (tool?: ToolMeta) => {
  document.title = tool ? `${tool.title} - DevBox` : 'DevBox - 브라우저 개발자 도구';
};

const icon = (name: string) => `<span aria-hidden="true" class="icon">${name}</span>`;

const nav = () => `
  <header class="app-header">
    <a class="brand" href="${withBase('/')}" aria-label="DevBox 홈">
      <span class="brand-mark">D</span>
      <span>
        <strong>DevBox</strong>
        <small>Browser-only tools</small>
      </span>
    </a>
    <nav class="nav-links" aria-label="주요 도구">
      ${tools.map((tool) => `<a href="${withBase(tool.path)}" ${routeTool?.id === tool.id ? 'aria-current="page"' : ''}>${tool.shortTitle}</a>`).join('')}
    </nav>
  </header>
`;

const adPlaceholder = (label: string) => `
  <aside class="ad-placeholder" aria-label="광고 영역">
    <ins class="adsbygoogle"
      style="display:block;width:100%;min-height:90px"
      data-ad-client="${adsenseClient}"
      data-ad-slot="${adsenseMainBottomSlot}"
      data-ad-format="auto"
      data-full-width-responsive="true"
      data-ad-label="${label}"></ins>
  </aside>
`;

const initializeAds = () => {
  window.requestAnimationFrame(() => {
    document.querySelectorAll<HTMLElement>('.adsbygoogle:not([data-ad-initialized="true"])').forEach((ad) => {
      if (ad.offsetWidth === 0) {
        window.setTimeout(initializeAds, 100);
        return;
      }

      ad.dataset.adInitialized = 'true';
      window.adsbygoogle = window.adsbygoogle || [];

      try {
        window.adsbygoogle.push({});
      } catch (error) {
        ad.dataset.adInitialized = 'false';
        console.warn('AdSense initialization skipped:', error);
      }
    });
  });
};

const footer = () => `
  <footer class="footer">
    <p>${privacyNotice}</p>
    <p>Static build ready for GitHub Pages, Netlify, Vercel, and Cloudflare Pages.</p>
  </footer>
`;

const renderShell = (content: string) => {
  if (!app) return;
  app.innerHTML = `
    ${nav()}
    <main>${content}</main>
    ${footer()}
  `;
  initializeAds();
};

const renderHome = () => {
  setTitle();
  renderShell(`
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">No server. No API. No account.</p>
        <h1>DevBox</h1>
        <p class="lead">개발 중 자주 필요한 인코딩, 해시, JSON, 문자열 변환 도구를 빠르게 사용하는 정적 유틸리티 박스입니다.</p>
      </div>
      <div class="hero-panel">
        <div class="metric"><strong>7</strong><span>MVP tools</span></div>
        <div class="metric"><strong>0</strong><span>server calls</span></div>
        <div class="metric"><strong>100%</strong><span>browser-local</span></div>
      </div>
    </section>

    <section class="tool-finder" aria-label="도구 찾기">
      <div class="search-row">
        <label class="search-box">
          <span>${icon('⌕')}</span>
          <input id="tool-search" type="search" placeholder="도구 이름, 키워드 검색" autocomplete="off" />
        </label>
        <div class="segments" role="tablist" aria-label="카테고리 필터">
          ${categories.map((category, index) => `<button class="segment ${index === 0 ? 'active' : ''}" data-category="${category}" type="button">${category}</button>`).join('')}
        </div>
      </div>
      <div id="tool-grid" class="tool-grid"></div>
    </section>

    <section class="popular">
      <h2>인기 도구</h2>
      <div class="quick-list">
        ${tools.slice(0, 4).map((tool) => `<a href="${withBase(tool.path)}">${tool.shortTitle}<span>${tool.summary}</span></a>`).join('')}
      </div>
    </section>

    ${adPlaceholder('main bottom')}
  `);

  const grid = document.querySelector<HTMLDivElement>('#tool-grid');
  const search = document.querySelector<HTMLInputElement>('#tool-search');
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.segment'));
  let activeCategory = 'All';

  const drawCards = () => {
    const term = search?.value.trim().toLowerCase() ?? '';
    const filtered = tools.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const haystack = [tool.title, tool.summary, tool.category, ...tool.keywords].join(' ').toLowerCase();
      return matchesCategory && haystack.includes(term);
    });

    if (!grid) return;
    grid.innerHTML = filtered
      .map(
        (tool) => `
          <a class="tool-card" href="${withBase(tool.path)}">
            <span class="tag">${tool.category}</span>
            <h2>${tool.shortTitle}</h2>
            <p>${tool.summary}</p>
          </a>
        `
      )
      .join('');
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category ?? 'All';
      buttons.forEach((item) => item.classList.toggle('active', item === button));
      drawCards();
    });
  });
  search?.addEventListener('input', drawCards);
  drawCards();
};

const setState = (patch: Partial<State>) => {
  Object.assign(state, patch);
  const output = document.querySelector<HTMLTextAreaElement>('#output');
  const status = document.querySelector<HTMLParagraphElement>('#status');
  if (output) output.value = state.output;
  if (status) {
    status.textContent = state.error || state.status;
    status.className = state.error ? 'status error' : 'status';
  }
};

const runAction = async (tool: ToolMeta, action: string) => {
  const input = document.querySelector<HTMLTextAreaElement>('#input')?.value ?? '';
  const uuidCount = Number(document.querySelector<HTMLInputElement>('#uuid-count')?.value ?? state.uuidCount);

  try {
    if (tool.id === 'base64') {
      const output = action === 'decode' ? decodeBase64(input) : action === 'url-decode' ? decodeUrlSafeBase64(input) : action === 'url-encode' ? encodeUrlSafeBase64(input) : encodeBase64(input);
      setState({ input, output, status: '변환이 완료되었습니다.', error: '' });
    }

    if (tool.id === 'sha256') {
      setState({ input, output: await sha256(input), status: 'SHA-256 해시를 생성했습니다.', error: '' });
    }

    if (tool.id === 'json') {
      const output = action === 'minify' ? minifyJson(input) : action === 'validate' ? 'Valid JSON' : prettyJson(input);
      setState({ input, output, status: action === 'validate' ? '유효한 JSON입니다.' : 'JSON 처리가 완료되었습니다.', error: '' });
    }

    if (tool.id === 'url') {
      const output = action === 'decode' ? decodeUrl(input) : action === 'query' ? parseQueryString(input) || 'Query string이 없습니다.' : encodeUrl(input);
      setState({ input, output, status: 'URL 처리가 완료되었습니다.', error: '' });
    }

    if (tool.id === 'html') {
      setState({ input, output: action === 'decode' ? decodeHtml(input) : encodeHtml(input), status: 'HTML Entity 처리가 완료되었습니다.', error: '' });
    }

    if (tool.id === 'uuid') {
      const count = Math.max(1, Math.min(100, uuidCount || 1));
      const output = Array.from({ length: count }, () => crypto.randomUUID()).join('\n');
      setState({ input, output, status: `${count}개의 UUID를 생성했습니다.`, error: '', uuidCount: count });
    }

    if (tool.id === 'text') {
      const stats = countText(input);
      setState({
        input,
        output: [`전체 글자 수: ${stats.chars}`, `공백 제외 글자 수: ${stats.charsNoSpaces}`, `줄 수: ${stats.lines}`, `UTF-8 바이트: ${stats.bytes}`].join('\n'),
        status: '텍스트 분석이 완료되었습니다.',
        error: ''
      });
    }
  } catch (error) {
    setState({ input, error: error instanceof Error ? error.message : '처리 중 오류가 발생했습니다.', status: '' });
  }
};

const actionButtons = (toolId: ToolId) => {
  const actions: Record<ToolId, [string, string, string][]> = {
    base64: [
      ['encode', '->', 'Base64 Encode'],
      ['decode', '<-', 'Base64 Decode'],
      ['url-encode', 'U+', 'URL Safe Encode'],
      ['url-decode', 'U-', 'URL Safe Decode']
    ],
    sha256: [['hash', '#', 'Generate SHA-256']],
    json: [
      ['pretty', '{}', 'Pretty Print'],
      ['minify', '-', 'Minify'],
      ['validate', 'OK', 'Validate']
    ],
    url: [
      ['encode', '->', 'URL Encode'],
      ['decode', '<-', 'URL Decode'],
      ['query', '?', 'QueryString']
    ],
    html: [
      ['encode', '->', 'HTML Encode'],
      ['decode', '<-', 'HTML Decode']
    ],
    uuid: [['generate', '+', 'Generate']],
    text: [['count', '#', 'Count']]
  };

  return actions[toolId].map(([action, symbol, label]) => `<button class="primary action" data-action="${action}" type="button" title="${label}">${icon(symbol)}<span>${label}</span></button>`).join('');
};

const relatedTools = (tool: ToolMeta) =>
  tools
    .filter((item) => item.id !== tool.id && (item.category === tool.category || item.category === 'Encoding'))
    .slice(0, 3)
    .map((item) => `<a href="${withBase(item.path)}">${item.shortTitle}<span>${item.summary}</span></a>`)
    .join('');

const renderTool = (tool: ToolMeta) => {
  setTitle(tool);
  state.input = '';
  state.output = '';
  state.status = '';
  state.error = '';

  renderShell(`
    <section class="tool-hero">
      <p class="eyebrow">${tool.category}</p>
      <h1>${tool.title}</h1>
      <p>${tool.description}</p>
    </section>

    <section class="workspace" aria-label="${tool.title} 실행 영역">
      <div class="toolbar">
        <div class="actions">${actionButtons(tool.id)}</div>
        ${tool.id === 'uuid' ? '<label class="count-control">개수 <input id="uuid-count" type="number" min="1" max="100" value="5" /></label>' : ''}
        <button class="ghost" id="sample" type="button" title="예시 입력">${icon('◎')}<span>Example</span></button>
        <button class="ghost" id="copy" type="button" title="결과 복사">${icon('Copy')}<span>Copy</span></button>
        <button class="ghost" id="clear" type="button" title="초기화">${icon('X')}<span>Clear</span></button>
      </div>

      <div class="io-grid">
        <label class="field">
          <span>Input</span>
          <textarea id="input" spellcheck="false" placeholder="여기에 입력하세요"></textarea>
        </label>
        <label class="field">
          <span>Result</span>
          <textarea id="output" spellcheck="false" readonly placeholder="결과가 여기에 표시됩니다"></textarea>
        </label>
      </div>
      <p id="status" class="status" aria-live="polite"></p>
    </section>

    ${adPlaceholder('tool workspace bottom')}

    <section class="info-grid">
      <article>
        <h2>사용 예시</h2>
        <pre>${tool.example}</pre>
      </article>
      <article>
        <h2>주의사항</h2>
        <p>${tool.caution}</p>
        <p>${privacyNotice}</p>
        ${tool.sensitive ? `<p>${sensitiveNotice}</p>` : ''}
      </article>
    </section>

    ${adPlaceholder('tool caution bottom')}

    <section class="related">
      <h2>관련 도구</h2>
      <div class="quick-list">${relatedTools(tool)}</div>
    </section>
  `);

  const input = document.querySelector<HTMLTextAreaElement>('#input');
  const output = document.querySelector<HTMLTextAreaElement>('#output');
  document.querySelectorAll<HTMLButtonElement>('.action').forEach((button) => {
    button.addEventListener('click', () => runAction(tool, button.dataset.action ?? ''));
  });
  document.querySelector<HTMLButtonElement>('#sample')?.addEventListener('click', () => {
    if (input) input.value = tool.example;
    if (tool.id === 'uuid') {
      const count = document.querySelector<HTMLInputElement>('#uuid-count');
      if (count) count.value = tool.example;
    }
    setState({ input: tool.example, status: '예시 입력을 불러왔습니다.', error: '' });
  });
  document.querySelector<HTMLButtonElement>('#copy')?.addEventListener('click', async () => {
    await copyText(output?.value ?? '');
    setState({ status: '결과를 클립보드에 복사했습니다.', error: '' });
  });
  document.querySelector<HTMLButtonElement>('#clear')?.addEventListener('click', () => {
    if (input) input.value = '';
    setState({ input: '', output: '', status: '초기화했습니다.', error: '' });
  });
};

if (routeTool) {
  renderTool(routeTool);
} else {
  renderHome();
}
