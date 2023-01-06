import tags from '../docs/.temp/dynamic/tags'

export default ({ Vue }) => {
  const computed = {}
  computed.$foo = () => {
    return 'NEKO'
  }
  Vue.mixin({
    computed,
  })
}
