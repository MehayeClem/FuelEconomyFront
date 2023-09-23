import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { serialize } from 'cookie';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

function createAxiosInstance(context?: GetServerSidePropsContext) {
	const axiosInstance = axios.create({
		baseURL: 'http://localhost:8081/api/v1'
	});

	axiosInstance.interceptors.request.use(
		config => {
			let accessToken;
			if (context) {
				accessToken = context.req.cookies.accessToken;
			} else {
				accessToken = Cookies.get('accessToken');
			}

			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			return config;
		},
		error => {
			return Promise.reject(error);
		}
	);

	axiosInstance.interceptors.response.use(
		response => {
			return response;
		},
		async error => {
			const originalRequest = error.config;

			if (error.response && error.response.status === 401) {
				let refreshToken;

				if (context) {
					refreshToken = context.req.cookies.refreshToken;
				} else {
					refreshToken = Cookies.get('refreshToken');
				}

				if (!refreshToken) {
					if (context) {
						context.res.writeHead(302, { Location: '/login' });
						context.res.end();
						return;
					} else {
						const router = useRouter();
						router.push('/login');
					}
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
						if (context) {
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
						} else {
							Cookies.set('accessToken', response.data.accessToken, {
								expires: new Date(new Date().getTime() + 10 * 60 * 1000)
							});
						}
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
