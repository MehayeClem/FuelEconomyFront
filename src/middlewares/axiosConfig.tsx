import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { serialize } from 'cookie';

function createAxiosInstance(context: GetServerSidePropsContext) {
	const axiosInstance = axios.create({
		baseURL: 'http://localhost:8081/api/v1'
	});

	axiosInstance.interceptors.request.use(
		config => {
			const accessToken = context.req.cookies.accessToken;

			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			return config;
		},
		error => {
			return Promise.reject(error);
		}
	);

	let cpt = 0;
	axiosInstance.interceptors.response.use(
		response => {
			return response;
		},
		async error => {
			const originalRequest = error.config;

			if (
				error.response &&
				error.response.status === 401 &&
				!originalRequest._retry
			) {
				cpt++;
				console.log(cpt);
				originalRequest._retry = true;

				const refreshToken = context.req.cookies.refreshToken;
				if (!refreshToken) {
					context.res.writeHead(302, { Location: '/login' });
					context.res.end();
					return;
				}

				try {
					const response = await axiosInstance.post(
						'/auth/refreshtoken',
						{},
						{
							headers: {
								Authorization: `Bearer ${refreshToken}`
							}
						}
					);
					if (response.status === 200) {
						const accessTokenCookie = serialize(
							'accessToken',
							response.data.accessToken,
							{
								expires: new Date(
									new Date().getTime() + 10 * 60 * 1000
								),
								path: '/'
							}
						);

						context.res.setHeader('Set-Cookie', accessTokenCookie);
						originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
						return axiosInstance(originalRequest);
					}
				} catch (error) {
					return Promise.reject(error);
				}
			}
			return Promise.reject(error);
		}
	);

	return axiosInstance;
}

export default createAxiosInstance;
