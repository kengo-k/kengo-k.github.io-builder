<template>
  <div class="bg-red-100">Hello, Global {{ name }}!</div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$site);
  },
  props: {
    name: String
  }
}
</script>
