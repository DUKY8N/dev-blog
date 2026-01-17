export type Project = {
  title: string
  description: string
  url: string
}

const projects = [
  {
    title: '개인 개발 블로그',
    description: 'Astro와 Tailwind로 만든 기술 블로그.',
    url: 'https://github.com/DUKY8N/dev-blog',
  },
  {
    title: '오픈소스 기여',
    description: '커뮤니티 프로젝트에 올린 PR과 패치들.',
    url: 'https://github.com/pulls?q=author%3ADUKY8N+is%3Amerged',
  },
] satisfies Project[]

export default projects
