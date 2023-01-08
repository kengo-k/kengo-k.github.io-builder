<template>
  <div class="bg-green-100">
    <ul>
      <li v-for="tagInfo in tags" :key="tagInfo.tag">
        <a :href="'/tags/' + tagInfo.tag.toLowerCase()"> {{ tagInfo.tag }}({{ tagInfo.articles.length }})</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import tags from "../../../../generated/dynamic/tags"
export default {
  data() {
    return {
      tags
    }
  }
}
</script>
