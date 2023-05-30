<template>
	<div>
		<h1>Office screen screen</h1>
		<hr>
		<button type="button" class="btn btn-danger" @click="makeLogout">Exit now</button>
	</div>
</template>

<script>
	import { mapActions } from 'vuex';

	export default {
		methods: {
			...mapActions('user', ['logout']),
			async makeLogout(){
				let res = await this.logout();

				if(res){
					this.$router.push({name: 'login'}).then(() => { 
						location.reload();
					});
				}
			}
		}
	}
</script>