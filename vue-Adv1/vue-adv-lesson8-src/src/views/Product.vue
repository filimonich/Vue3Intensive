<template>
	<div v-if="hasProduct">
		<h1>{{ product.title }}</h1>
		<hr>
		<div class="alert alert-success">
			{{ product.price }}
		</div>
		<hr>
		<product-controls :id="id"></product-controls>
		<hr>
		<router-link :to="{name: 'products'}">
			Back to products
		</router-link>
		<hr>
		<div class="mb-3">
			Current Product Rating: {{ rating.average }} ({{ rating.count }} marks)
		</div>
		<div class="row" v-if="canSetRating">
			<div class="col col-2">
				<div><small>Your last mark: {{ userMark.last || 'none' }} </small></div>
				<div><small>Your current mark: {{ userMark.current || 'none' }}</small></div>
			</div>
			<div class="col col-8">
				<app-rating v-model:value="userMark.current"></app-rating>
			</div>
			<div class="col col-2">
				<button class="btn btn-primary" :disabled="!canSendMark" @click="sendMark">Send</button>
			</div>
		</div>
		<hr>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis voluptate necessitatibus ullam dolorum laudantium, eos deleniti cupiditate atque magnam autem dignissimos aliquam aut aliquid quae vero, quaerat consectetur eius animi!</p>
		<p>Iusto facere fuga, voluptatum numquam optio eos modi aliquam, odit a ad alias ex laborum quis voluptates, iste incidunt! Veritatis rem fuga aspernatur, sapiente saepe iste libero ab quo aliquid.</p>
		<p>Consequatur nulla voluptates cum minus illo tempore architecto magnam dolorem reiciendis saepe, recusandae eaque nihil beatae mollitia minima quae natus, facilis. Maxime dolore, nobis. Iusto numquam eligendi amet enim inventore!</p>
		<p>Qui reprehenderit quae, ipsam odio tempore minima molestias placeat vel, eius quidem itaque assumenda sed dolores a commodi, quibusdam fuga eveniet cum. Doloremque, assumenda rem. Vel perferendis architecto, ab magnam.</p>
	</div>
	<app-404 v-else /> 
</template>
<script>
	import App404 from '@/components/E404';
	import ProductControls from '@/components/ProductControls';
	import AppRating from '@/components/Rating';
	import { mapGetters } from 'vuex';

	export default {
		$head(){
			return {
				title: this.hasProduct ? 
							this.product.title + ', ' + this.rating.average: 
							'Product not found'
			}
		},
		components: {
			App404,
			ProductControls,
			AppRating
		},
		async asyncData(api, params){
			let { res, data } = await api.products.rating(params.id);
			let mockData = res ? data : { average: 0, count: 0, your: null };
			let { average, count, your } = mockData;
			return { rating: { average, count, your }};
		},
		data(){
			return {
				userMark: {
					current: 0,
					last: 0,
					pending: false
				}
			}
		},
		computed: {
			...mapGetters('products', { productProxy: 'one' }),
			...mapGetters('user', { userReady: 'ready', checkRole: 'checkRole' }),
			id(){
				return +this.$route.params.id; // may be better
			},
			product(){
				return this.productProxy(this.id);
			},
			hasProduct(){
				return typeof this.product !== 'undefined';
			},
			canSetRating(){
				return this.checkRole(['auditor']);
			},
			canSendMark(){
				return !this.userMark.pending && this.userMark.current != this.userMark.last;
			}
		},
		methods: {
			async getRating(){
				let { res, data } = await this.$api.products.rating(this.id);
				
				if(res){
					let { average, count, your } = data;
					this.rating = { ...this.rating, average, count, your };

					if(your !== null){
						this.userMark.last = your;
						this.userMark.current = your;
					}
				}
			},
			async sendMark(){
				if(this.canSendMark){
					this.userMark.pending = true;

					let { res, data } = await this.$api.products.mark(this.id, this.userMark.current);

					if(res && data){
						await this.getRating();
					}

					this.userMark.pending = false;
				}
			}
		},
		async created(){
			await this.userReady;

			if(this.canSetRating){
				this.getRating();
			}
		}
	}
</script>