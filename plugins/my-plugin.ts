interface Option {}
interface Page {
  key: string
  frontmatter: Frontmatter
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

export default (_: Option, context: Context) => {
  return {
    name: 'my-plugin',

    async ready() {
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
      const tags = Object.keys(tagMap).map((tag) => {
        return {
          tag,
          articles: tagMap[tag],
        }
      })
      return [
        {
          name: `tags.js`,
          content: `export default ${JSON.stringify(tags, null, 2)}`,
        },
      ]
    },

    //enhanceAppFiles: [path.resolve(__dirname, './generate.js')],
  }
}
