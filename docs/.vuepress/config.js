const MyPlugin = require('../../plugins/my-plugin.js')

module.exports = {
  postcss: {
    plugins: [require('tailwindcss'), require('autoprefixer')],
  },
  plugins: ['@vuepress/last-updated', MyPlugin],
  temp: 'docs/.temp',
}
