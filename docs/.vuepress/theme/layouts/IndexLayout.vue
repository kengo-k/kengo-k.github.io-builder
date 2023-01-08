<template>
  <!-- <ArticleList :articles="latest_articles" :articles_map="articles_map"/> -->
</template>

<script>
//import { usePageData } from '@vuepress/client'
import articles_map from "../../../../generated/dynamic/articles_map.js"
import ArticleList from "../components/ArticleList.vue"

export default {
  name: 'IndexLayout',

  components: {
    ArticleList
  },

  setup() {
    console.log("NEKONEKO")
    console.log(this)
  },

  data () {
    return {
    }
  },

  computed: {
  },

  mounted () {
  },

  methods: {
  }
}
</script>