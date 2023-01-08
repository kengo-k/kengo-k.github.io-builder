<template>
  <div class="bg-purple-100">
    <ul>
      <li v-for="article in articles" :key="article.path">
        <div>
          <div>{{ article.path }}</div>
          <a :href="article.path">{{ articles_map[article.key]["title"] }}</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    articles: {
      type: Array
    },
    articles_map: {
      type: Object
    }
  }
}
</script>
