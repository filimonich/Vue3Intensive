const LOCAL_ACCESS_NAME = 'auth_accessToken';

function setTokens(access){
	if(process.isClient){
		localStorage.setItem(LOCAL_ACCESS_NAME, access);
	}
}

function cleanTokensData(){
	if(process.isClient){
		localStorage.removeItem(LOCAL_ACCESS_NAME);
	}
}

function getAccessToken(){
	if(process.isClient){
		return localStorage.getItem(LOCAL_ACCESS_NAME);
	}
}

function getJWTPayload(token){
	return parseJWT(token).payload;
}

function parseJWT(token){
	let parts = token.split('.');

	return {
		header: parsePart(parts[0]),
		payload: parsePart(parts[1]),
		sign: parts[2]
	};
}

function parsePart(str){
	return JSON.parse(window.atob(str));
}

export { setTokens, cleanTokensData, getJWTPayload, getAccessToken }