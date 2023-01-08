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

interface DynamicModule {
  name: string
  content: string
}

interface Context {
  addPage: (pageInfo: PageInfo) => void
  pages: Page[]
  dynamicModules?: DynamicModule[]
}

interface PageInfo {
  permalink: string
  frontmatter: {
    layout: string
    title: string
  }
  meta: {
    article_keys?: string[]
  }
}

interface ArticlesByTag {
  tag: string
  articles: string[]
}

export default (_: Option, context: Context) => {
  return {
    name: 'my-plugin',
    extendPageData(page: any) {
      console.log('extend!')
      if (page._meta != null) {
        page.data = {
          article_ids: page._meta.article_ids,
        }
      }
      // page.xxx = 'HELLO'
      // page.data = {}
      // page.data.yyy = 'WORLD'
      // if (page._meta != null) {
      //   //Object.assign(page, { NEKO: 'NYA' })
      //   //console.log('extend!!!!', page)
      // }
      console.log(page)
    },
    async additionalPages() {
      console.log('additional!')
      console.log('length: ', context.pages.length)

      const pages = context.pages
      const articles_map = generateArticlesMap(pages)
      const latest_articles = generateLatestArticles(pages, 10)
      const tags = generateTags(pages)

      context.dynamicModules = [
        { name: 'articles_map.js', content: generate(articles_map) },
        { name: 'latest_articles.js', content: generate(latest_articles) },
        { name: 'tags.js', content: generate(tags) },
      ]

      const tagPages = tags.map((t) => {
        return {
          // permalink: `/tags/${t.tag.toLowerCase()}.html`,
          // frontmatter: {
          //   layout: 'IndexLayout',
          //   title: 'test',
          // },
          // meta: {
          //   article_keys: t.articles,
          // },
          path: `/tags/${t.tag.toLowerCase()}.html`,
          filePath: __dirname + '/../template/ArticleList.md',
          meta: {
            article_ids: t.articles,
          },
        }
      })

      return [...tagPages]

      // // Note that VuePress doesn't have request library built-in
      // // you need to install it yourself.
      // const rp = require('request-promise')
      // const content = await rp(
      //   'https://raw.githubusercontent.com/vuejs/vuepress/master/CHANGELOG.md'
      // )
      // return [
      //   {
      //     path: '/changelog/',
      //     content,
      //   },
      // ]
      //return []
    },
    async ready() {
      console.log('ready!!!')
      //console.log('UHOOOOO', context.pages)

      // const tagPages = tags.map((t) => {
      //   return {
      //     permalink: `/tags/${t.tag.toLowerCase()}.html`,
      //     frontmatter: {
      //       layout: 'IndexLayout',
      //       title: 'test',
      //     },
      //     meta: {
      //       article_keys: t.articles,
      //     },
      //   }
      // })

      // const additionalPages = [...tagPages]

      // await Promise.all(
      //   additionalPages.map(async (page) => context.addPage(page))
      // )
    },
    async clientDynamicModules() {
      return context.dynamicModules
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
