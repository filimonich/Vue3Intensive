<template>
  <div class="ratings">
    <i
      v-for="num in max"
      :key="num"
      :class="{ 'rating-color': num <= value }"
      @click="$emit('update:value', num)"
      >&#9734;</i
    >
  </div>
</template>
<script>
export default {
  props: {
    value: Number,
    max: {
      type: Number,
      default: 5,
    },
  },
};
</script>

<style scoped>
.ratings {
  margin-right: 10px;
}

.ratings i {
  color: #cecece;
  font-size: 32px;
  font-style: normal;
}

.rating-color {
  color: #fbc634 !important;
}
</style>
