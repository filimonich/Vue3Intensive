<template>
	<div>
		<h1>Office screen, hello, {{ userName }}</h1>
		<hr>
		<button type="button" class="btn btn-danger" @click="makeLogout">Exit now</button>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';

	export default {
		$head: () => ({
			title: 'Office, main screen'
		}),
		computed: {
			...mapGetters('user', ['userName'])
		},
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