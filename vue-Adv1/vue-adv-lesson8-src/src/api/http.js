import axios from 'axios';

export default () => {
	const baseURL = 'https://wp.dmitrylavrik.ru/vue-advanced-api-l3/';
	const instance = axios.create({
		baseURL,
		timeout: 10000,
		withCredentials: true
	});

	return instance;
}