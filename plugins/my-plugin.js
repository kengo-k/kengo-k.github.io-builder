const path = require('path')

module.exports = (options, context) => {
  console.log('AAAAAAAAAAvbbb')
  //console.log(context.themeAPI)
  return {
    name: 'my-plugin',
    async additionalPages() {
      //console.log(context)
      //console.log(context.pages)
      //return [{ path: '/posts/', filePath: path.resolve(__dirname, 'Foo.md') }]
      return []
    },
    async clientDynamicModules() {
      console.log('clientDynamicModules')
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
      console.log(tagMap)
      return [
        {
          name: `tags.js`,
          content: `export default ${JSON.stringify(tagMap, null, 2)}`,
        },
      ]
    },
  }
}
