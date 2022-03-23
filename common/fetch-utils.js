const fetchJson = async (url, config) => {

	config = config || {};

	let response;

	try {
		if ((config.method || '').toUpperCase() === 'GET' && urlIsCacheable(url)) {

			const data = getFromCache(url);
			if (data)
				return data;
		}

		response = await fetch(url, config);
	}
	catch(error) {

		console.error(error);

		throw {
			status: 0,
			data: {message: 'Falha ao executar operação'}
		};
	}

	let data = null;

	// Tentar obter o cabeçalho "Content-Type"
	var contentType = response.headers.get('Content-Type');

	// Verificar se obteve o cabeçalho e se o tipo do conteudo é JSON
	if (contentType && (contentType.indexOf('application/json') >= 0 || contentType.indexOf('text/plain') >= 0)) {

		// Ler conteudo no formato JSON
		data = await response.json();
	}

	if (response.status < 200 || response.status >= 300) {
		throw {
			status: response.status,
			data: data
		};
	}

	if ((config.method || '').toUpperCase() === 'GET' && urlIsCacheable(url)) {

		saveToCache(url, data);
	}

	return data;
};

const postJson = (url, data, useToken) => {

	const headerValues = {
		'Content-Type': 'application/json'
	};

	if (useToken) {

		headerValues.Authorization = getToken();
	}

	return fetchJson(url, {
		method: 'POST',
		headers: headerValues,
		body: JSON.stringify(data)
	});
};

const getJson = (url, useToken) => {

	const headerValues = {};

	if (useToken) {

		headerValues.Authorization = getToken();
	}

	return fetchJson(url, {
		method: 'GET',
		headers: headerValues
	});
};

const deleteJson = (url, useToken) => {

	const headerValues = {};

	if (useToken) {

		headerValues.Authorization = getToken();
	}

	return fetchJson(url, {
		method: 'DELETE',
		headers: headerValues
	});
};

const putJson = (url, data, useToken) => {

	const headerValues = {
		'Content-Type': 'application/json'
	};

	if (useToken) {

		headerValues.Authorization = getToken();
	}

	return fetchJson(url, {
		method: 'PUT',
		headers: headerValues,
		body: JSON.stringify(data)
	});
};

const saveToken = (token) => {

    localStorage.setItem('app-token', token);
};

const getToken = () => {

    return localStorage.getItem('app-token');
};