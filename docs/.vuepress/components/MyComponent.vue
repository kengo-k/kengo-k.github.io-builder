<template>
  <div class="my-component">
    Hello, {{ name }}!
    <ul>
      <li>{{ "HELLO" }}</li>
      <li>{{ name.toLowerCase() }}</li>
      <li>{{ new Date() }}</li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
    name: String
  },
}
</script>

<style>
  .my-component {
    background-color: cyan;
  }
</style>
