// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Pretendard Variable',
      cssVariable: '--font-pretendard',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/PretendardVariable.woff2'],
            weight: '45 920',
            style: 'normal'
          }
        ]
      }
    }
  ],
  markdown: {
    shikiConfig: {
      theme: 'catppuccin-mocha'
    }
  }
});
