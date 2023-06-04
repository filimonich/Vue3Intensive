import createCartApi from './cart';
import createAuthApi from './auth';
import createOrdersApi from './orders';
import createProductsApi from './products';

export default http => ({
	auth: createAuthApi(http),
	cart: createCartApi(http),
	orders: createOrdersApi(http),
	products: createProductsApi(http)
});