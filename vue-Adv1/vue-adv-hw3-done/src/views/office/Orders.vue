<template>
	<div>
		<h1>User orders</h1>
	</div>
</template>

<script>
	import * as ordersApi from '@/api/orders';

	export default {
		created(){
			ordersApi.all().then(console.log).catch(console.warn);
		}
	}
</script>