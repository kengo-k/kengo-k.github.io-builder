import tags from '../docs/.temp/dynamic/tags'

export default ({ Vue }) => {
  console.log('enhance!')
  const computed = {}
  computed.$foo = () => {
    return 'NEKO'
  }
  Vue.mixin({
    computed,
  })
}
