<template>
  <div>
    <ul>
      <li v-for="tagInfo in tags" :key="tagInfo.tag">{{ tagInfo.tag }}({{ tagInfo.articles.length }})</li>
    </ul>
  </div>
</template>

<script>
import tags from "../../../.temp/dynamic/tags"
export default {
  mounted() {
    console.log(this.$site);
  },
  props: {
    name: String
  }
  ,data() {
    return {
      tags
    }
  }
}
</script>
