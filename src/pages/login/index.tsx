import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ZodType, z } from 'zod';
import Form from '../../components/form';
import { LoginFormData, InputFields } from '../../types/form';
import Cookies from 'js-cookie';

export default function Login() {
	const router = useRouter();

	const loginValidationSchema: ZodType<LoginFormData> = z.object({
		email: z.string().email('Mauvaise adresse mail'),
		password: z
			.string()
			.min(5, {
				message: 'Le mot de passe doit comporter au moins 5 caractères'
			})
			.regex(
				/^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{5,20}$/,
				'Le mot de passe doit respecter les critères suivant : 1 caractère spécial, 1 majuscule, 1 chiffre, 5 caractères minimum'
			)
	});

	const formFields: InputFields<LoginFormData>[] = [
		{
			type: 'email',
			name: 'email',
			id: 'email',
			required: true,
			register: 'email'
		},
		{
			type: 'password',
			name: 'password',
			id: 'password',
			required: true,
			register: 'password'
		}
	];

	const submitData = async (data: LoginFormData) => {
		const { email, password } = data;

		try {
			const response = await axios.post(
				'http://localhost:8081/api/v1/auth/login',
				{
					email: email,
					password: password
				}
			);
			Cookies.set('access-token', response.data.accessToken, {
				expires: new Date(new Date().getTime() + 10 * 60 * 1000)
			});
			Cookies.set('refresh-token', response.data.refreshToken, {
				expires: 1
			});
			router.push('/');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(error.response);
			}
		}
	};

	return (
		<section>
			<h1>Login page</h1>
			<Form
				validationSchema={loginValidationSchema}
				onSubmit={submitData}
				formFields={formFields}
			></Form>
		</section>
	);
}
