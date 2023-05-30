import http from '@/api/http';

export async function all(){
	let { data } = await http.get('products.php');
	return data;
}

export async function rating(id){
	let { data } = await http.get('ratings.php', {
		params: { id },
		errorAlert: { text: 'при получении рейтинга товара' }
	});
	return data;
}

export async function mark(id, mark){
	let { data } = await http.put('ratings.php', { id, mark }, {
		errorAlert: { text: 'при оценке товара' }
	});
	return data;
}