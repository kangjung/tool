import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const page = (name: string) => resolve(__dirname, name, 'index.html');

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        base64: page('base64'),
        sha256: page('sha256'),
        json: page('json'),
        url: page('url'),
        html: page('html'),
        uuid: page('uuid'),
        text: page('text')
      }
    }
  }
});
