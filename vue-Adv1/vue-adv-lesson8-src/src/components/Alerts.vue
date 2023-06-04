<template>
	<div class="box">
		<transition-group name="item" tag="div">
			<div class="item" v-for="alert in alerts" :key="alert.id">
				{{ alert.text }}
				<p v-if="alert.critical">
					Ошибка не позволит сайту работать, 
					<a href="#" @click="location.reload()">перезагрузите страницу</a>
				</p>
			</div>
		</transition-group>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex';
	import './alerts-critical.css';

	export default {
		computed: {
			...mapGetters('alerts', { alerts: 'all' }),
			location(){
				return window.location;
			}
		}
	}
</script>
<style src="./alerts.css"></style>