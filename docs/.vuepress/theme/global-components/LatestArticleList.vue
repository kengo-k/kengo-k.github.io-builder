<template>
  <div class="bg-green-100">
    <ul>
      <li v-for="article in latest_articles" :key="article.path">
        {{ article.path }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import latest_articles from "../../../../generated/dynamic/latest_articles.js"
import articles_map from "../../../../generated/dynamic/latest_articles.js"
export default {
  data() {
    return {
      latest_articles, articles_map
    }
  }
}
</script>
