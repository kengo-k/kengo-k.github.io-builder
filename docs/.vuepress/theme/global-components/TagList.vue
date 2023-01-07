<template>
  <div class="bg-green-100">
    <ul>
      <li v-for="tagInfo in tags" :key="tagInfo.tag">
        {{ tagInfo.tag }}({{ tagInfo.articles.length }})
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
