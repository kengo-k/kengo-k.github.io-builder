interface Option {}

interface Page {
  key: string
  frontmatter: Frontmatter
  path: string
  title: string
}

interface Frontmatter {
  tags: string[]
}

interface Context {
  addPage: (pageInfo: PageInfo) => void
  pages: Page[]
}

interface PageInfo {
  permalink: string
  frontmatter: {
    layout: string
    title: string
  }
  meta: {
    pid: string
    id: string
  }
}

interface ArticlesByTag {
  tag: string
  articles: string[]
}

export default (_: Option, context: Context) => {
  return {
    name: 'my-plugin',

    async ready() {
      console.log('UHOOOOO', context.pages)
      const pages: PageInfo[] = [
        {
          permalink: '/neko',
          frontmatter: {
            layout: 'IndexLayout',
            title: 'test',
          },
          meta: {
            pid: 'post',
            id: 'post',
          },
        },
      ]
      await Promise.all(pages.map(async (page) => context.addPage(page)))
    },
    async clientDynamicModules() {
      const pages = context.pages
      return [
        {
          name: 'articles_map.js',
          content: generate(generateArticlesMap(pages)),
        },
        {
          name: 'latest_articles.js',
          content: generate(generateLatestArticles(pages, 10)),
        },
        {
          name: 'tags.js',
          content: generate(generateTags(pages)),
        },
      ]
    },

    //enhanceAppFiles: [path.resolve(__dirname, './generate.js')],
  }
}

const generate = (data: any): string => {
  return `export default ${JSON.stringify(data, null, 2)}`
}

const generateTags = (pages: Page[]): ArticlesByTag[] => {
  const tagMap = {}
  pages.forEach((p) => {
    const f = p.frontmatter
    const tags = f.tags
    if (tags != null) {
      for (const tag of tags) {
        if (!(tag in tagMap)) {
          tagMap[tag] = []
        }
        tagMap[tag].push(p.key)
      }
    }
  })
  return Object.keys(tagMap).map((tag) => {
    return {
      tag,
      articles: tagMap[tag],
    }
  })
}

const generateArticlesMap = (pages: Page[]) => {
  const articleMap = {}
  for (const page of pages) {
    articleMap[page.key] = {
      path: page.path,
      title: page.title,
    }
  }
  return articleMap
}

const generateLatestArticles = (pages: Page[], count: number) => {
  let i = 0
  const articles = pages.flatMap((p) => {
    if (i >= count) {
      return []
    }
    if (p.path.startsWith('/posts')) {
      i++
      return [{ key: p.key, path: p.path }]
    }
    return []
  })
  articles.sort((a, b) => {
    if (a.path === b.path) {
      return 0
    }
    if (a.path < b.path) {
      return -1
    }
    return 1
  })
  return articles
}
