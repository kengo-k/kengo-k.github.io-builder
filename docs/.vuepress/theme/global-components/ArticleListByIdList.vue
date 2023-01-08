<template>
  <ArticleList :articles="getArticles()" :articles_map="articles_map"/>
</template>

<script lang="js">

import articles_map from "../../../../generated/dynamic/articles_map.js"
import ArticleList from "../components/ArticleList.vue"

export default {
  components: {
    ArticleList
  },
  props: {
    article_ids: {
      type: Array
    }
  },
  data() {
    return {
      articles_map
    }
  },
  methods: {
    getArticles() {
      return this.article_ids.map(id => {
        return {
          key: id,
          path: articles_map[id].path
        }
      })
    }
  }
}
</script>
