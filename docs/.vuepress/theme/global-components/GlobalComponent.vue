<template>
  <div class="bg-red-100">Hello, Global {{ name }}!</div>
</template>

<script>
export default {
  props: {
    name: String
  }
}
</script>
