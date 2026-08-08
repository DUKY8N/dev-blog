// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// https://astro.build/config
export default defineConfig({
  prefetch: true,
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
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex]
    }),
    shikiConfig: {
      theme: 'catppuccin-mocha'
    }
  }
});
