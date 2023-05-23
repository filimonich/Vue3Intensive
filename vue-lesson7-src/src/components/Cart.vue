<template>
  <div>
    <h1>Cart</h1>
    <hr />
    <div>table</div>
    <router-link class="btn btn-success" :to="{ name: 'checkout' }">
      Order now
    </router-link>
  </div>
</template>

<script>
export default {};
</script>
