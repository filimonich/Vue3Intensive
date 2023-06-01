export default http => ({
	async all(){
		let { data } = await http.get('orders.php', {
			errorAlert: 'при получении списка заказов'
		});
		return data;
	}
})