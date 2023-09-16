import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ZodType, z } from 'zod';
import Form from '../../components/form';
import { LoginFormData, InputFields } from '../../types/form';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import FeLogo from '../../public/images/FeLogo.png';

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
				'Le mot de passe doit respecter les critères suivants : 1 caractère spécial, 1 majuscule, 1 chiffre, 5 caractères minimum'
			)
	});

	const formFields: InputFields<LoginFormData>[] = [
		{
			type: 'email',
			name: 'email',
			id: 'email',
			required: true,
			register: 'email',
			label: 'Email'
		},
		{
			type: 'password',
			name: 'password',
			id: 'password',
			required: true,
			register: 'password',
			label: 'Mot de passe'
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
			Cookies.set('accessToken', response.data.accessToken, {
				expires: new Date(new Date().getTime() + 10 * 60 * 1000)
			});
			Cookies.set('refreshToken', response.data.refreshToken, {
				expires: 1
			});
			router.push('/');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage =
					error.response?.data || 'Une erreur est survenue';
				toast.error(errorMessage.toString(), {
					pauseOnHover: false
				});
			}
		}
	};

	return (
		<section className="login__container">
			<div className="form__card">
				<div className="form__title">
					<Image src={FeLogo} alt="FuelEconomy logo" priority></Image>
					<h1>Connexion</h1>
				</div>

				<Form
					validationSchema={loginValidationSchema}
					onSubmit={submitData}
					formFields={formFields}
					labelButton="Connexion"
				></Form>

				<div className="form__link">
					<div>
						<span>Pas encore de compte ?</span>
						<Link href="/register">Créer son compte</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
