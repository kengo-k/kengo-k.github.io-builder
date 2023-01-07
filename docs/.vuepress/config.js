const MyPlugin = require('../../build/my-plugin')

module.exports = {
  postcss: {
    plugins: [require('tailwindcss'), require('autoprefixer')],
  },
  plugins: ['@vuepress/last-updated', MyPlugin],
  temp: 'docs/.temp',
}
