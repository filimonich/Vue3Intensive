<template>
	<div>
		<h1>User orders</h1>
	</div>
</template>

<script>
	export default {
		created(){
			this.$api.orders.all().then(console.log).catch(console.warn);
		}
	}
</script>