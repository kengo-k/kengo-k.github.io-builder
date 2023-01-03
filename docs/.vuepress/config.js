module.exports = {
  postcss: {
    plugins: [require('tailwindcss'), require('autoprefixer')],
  },
  plugins: ['@vuepress/last-updated'],
}
