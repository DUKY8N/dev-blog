import type { Site, Metadata, Socials } from '@/types'

export const SITE: Site = {
  NAME: 'Duky8n',
  EMAIL: 'DUKY8N@gmail.com',
  NUM_PROJECTS_ON_HOMEPAGE: 3,
  NUM_POSTS_ON_HOMEPAGE: 3,
}

export const HOME: Metadata = {
  TITLE: 'Home',
  DESCRIPTION: `임덕윤(${SITE.NAME})의 홈페이지.`,
}

export const BLOG: Metadata = {
  TITLE: 'Blog',
  DESCRIPTION: '',
}

export const PROJECTS: Metadata = {
  TITLE: 'Projects',
  DESCRIPTION: '',
}

export const SOCIALS: Socials = [
  {
    NAME: 'x',
    HREF: 'https://x.com/duky8n',
  },
  {
    NAME: 'github',
    HREF: 'https://github.com/DUKY8N',
  },
]
