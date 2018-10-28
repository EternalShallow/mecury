<template>
  <div
    id="main"
    class="app-main">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: this.$store.state.theme,
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {},
};
</script>

<style lang="less">
[v-cloak] {
  display: none;
}

html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  overflow: hidden;
}

.app-main {
  width: 100%;
  height: 100%;
}
</style>
