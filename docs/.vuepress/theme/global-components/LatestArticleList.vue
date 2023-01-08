<template>
  <ArticleList :articles="latest_articles" :articles_map="articles_map"/>
</template>

<script lang="ts">

import latest_articles from "../../../../generated/dynamic/latest_articles.js"
import articles_map from "../../../../generated/dynamic/articles_map.js"
import ArticleList from "../components/ArticleList.vue"

export default {
  components: {
    ArticleList
  },
  data() {
    return {
      latest_articles, articles_map
    }
  }
}
</script>
