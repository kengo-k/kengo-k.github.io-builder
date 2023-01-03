<template>
  <div class="m-20">
    This is a Layout!
    <GlobalComponent name="My Component" />
    <HelloComponent name="My Component" />
    <Content />
  </div>
</template>

<script>
import HelloComponent from "../components/HelloComponent.vue"

export default {
  name: 'Layout',

  components: {
    HelloComponent
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

<!-- <style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style> -->

<!-- <style>
@import "../styles/index.styl";
</style> -->