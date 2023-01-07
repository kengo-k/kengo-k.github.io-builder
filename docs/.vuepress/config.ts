import MyPlugin from '../../build/my-plugin'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
  postcss: {
    plugins: [tailwindcss, autoprefixer],
  },
  plugins: ['@vuepress/last-updated', MyPlugin],
  temp: 'generated',
}
