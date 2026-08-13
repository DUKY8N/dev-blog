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
    },
    {
      provider: fontProviders.local(),
      name: 'Iosevka',
      cssVariable: '--font-iosevka',
      // Fallbacks are chained through --font-source-han-sans-k in tokens.css.
      fallbacks: [],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/Iosevka-Regular.woff2'],
            weight: 400,
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/Iosevka-Italic.woff2'],
            weight: 400,
            style: 'italic'
          },
          {
            src: ['./src/assets/fonts/Iosevka-Bold.woff2'],
            weight: 700,
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/Iosevka-BoldItalic.woff2'],
            weight: 700,
            style: 'italic'
          }
        ]
      }
    },
    {
      provider: fontProviders.local(),
      name: 'Source Han Sans K',
      cssVariable: '--font-source-han-sans-k',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/SourceHanSansK-VF.ttf.woff2'],
            weight: '250 900',
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
