<template>
  <div>
    <h1>Page not found</h1>
    <hr />
    Start from <router-link :to="{ name: 'products' }">main page</router-link>
  </div>
</template>
<script>
export default {
  created() {
    this.$router.appIs404 = true;
  },
};
</script>
