import { getAccessToken, setTokens, cleanTokensData } from '@/utils/tokens';

export default function connectHttpWithTokens(http){
	http.interceptors.request.use(addAccessToken);
	http.interceptors.response.use(
		r => r,
		setupRefreshAndRepeat(http)
	);
}

function addAccessToken(request){
	let token = getAccessToken();

	if(token){
		request.headers.Authorization = `Bearer ${token}`;
	}

	return request;
}

function setupRefreshAndRepeat(http){
	return async function(error){
		if(error.response?.status !== 401){
			return Promise.reject(error); // ошибка, не связанная с авторизацией
		}
	
		cleanTokensData();
		let response = await http.get('auth/refresh/refresh.php');

		if(!response.data.res){
			return Promise.reject(error); // прокидываем 401 код дальше, если не удалось refresh
		}
		
		setTokens(response.data.accessToken);
		return http.request(error.config);
	}
}