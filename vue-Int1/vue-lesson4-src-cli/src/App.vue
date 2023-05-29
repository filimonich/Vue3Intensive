<template>
	<div class="container mt-2">
		<div class="Todo">
			<h1>Your actions</h1>
			<app-todo-action 
				v-for="action,i in todoList"
				:key="i"
				:title="action.title" 
				:value="action.current" 
				:max="action.max"
				@step="makeStep(i)"
			></app-todo-action>
			<hr>
			<button class="btn btn-success" :class="$style.appbtn">Finish</button>
		</div>
	</div>
</template>

<script>
import AppTodoAction from './components/TodoAction.vue';

export default {
	components: {
		AppTodoAction
	},
	data: () => ({
		todoList: [
			{ title: 'First action', current: 0, max: 5 },
			{ title: 'Other work', current: 0, max: 10 },
			{ title: 'Some fun', current: 0, max: 7 }
		]
	}),
	methods: {
		makeStep(i){
			let action = this.todoList[i];

			if(action.current < action.max){
				action.current++;
			}
		}
	}
}
</script>

<style module>
	.appbtn{
		display: block !important;
		width: 100%;
	}
</style>