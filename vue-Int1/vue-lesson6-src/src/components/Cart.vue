<template>
  <div>
    <div>In Cart: {{ cnt }}</div>
    <div>Total: {{ total }}</div>
    <div>$: {{ some }}</div>
    <hr />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["cnt", "total"]),
    some() {
      return this.total / 120;
    },
  },
};

/*
		mapGetters(['cnt', 'total'])

		{
			cnt(){
				return this.$store.getters.cnt;
			},
			total(){
				return this.$store.getters.total;
			}
		}

	*/
</script>
