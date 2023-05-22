<template>
  <div class="form-group">
    <label>
      {{ label }}
      <fa-icon
        v-if="activated"
        :class="valid ? 'text-success' : 'text-danger'"
        :icon="valid ? 'check-circle' : 'exclamation-circle'"
      />
    </label>
    <input type="text" class="form-control" :value="value" @input="onInput" />
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    valid: { type: Boolean, required: true },
  },
  data() {
    return {
      activated: this.value != "",
    };
  },
  methods: {
    onInput(e) {
      this.activated = true;
      this.$emit("updated", e.target.value);
    },
  },
};
</script>
