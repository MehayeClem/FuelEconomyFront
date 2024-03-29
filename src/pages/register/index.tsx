import React from 'react';
import axios from 'axios';
import { ZodType, z } from 'zod';
import Form from '../../components/form';
import { RegisterFormData, InputFields } from '../../types/form';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import FeLogo from '../../public/images/FeLogo.png';
import { FaAngleLeft } from 'react-icons/fa6';

export default function Register() {
	const router = useRouter();

	const registerValidationSchema: ZodType<RegisterFormData> = z
		.object({
			username: z
				.string()
				.min(3, {
					message:
						"Le nom d'utilisateur doit comporter au moins 3 caractères"
				})
				.max(20, {
					message:
						"Le nom d'utilisateur doit comporter au maximum 20 caractères"
				}),
			email: z.string().email('Mauvaise adresse mail'),
			password: z
				.string()
				.min(5, {
					message: 'Le mot de passe doit comporter au moins 5 caractères'
				})
				.regex(
					/^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{5,20}$/,
					'Le mot de passe doit respecter les critères suivant : 1 caractère spécial, 1 majuscule, 1 chiffre, 5 caractères minimum'
				),
			confirmPassword: z
				.string()
				.regex(
					/^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{5,20}$/,
					'Le mot de passe doit respecter les critères suivant : 1 caractère spécial, 1 majuscule, 1 chiffre, 5 caractères minimum'
				)
		})
		.refine(data => data.password === data.confirmPassword, {
			path: ['confirmPassword'],
			message: 'Les mots de passe ne correspondent pas'
		});

	const formFields: InputFields<RegisterFormData>[] = [
		{
			type: 'text',
			name: 'username',
			id: 'username',
			required: true,
			register: 'username',
			label: 'Pseudo'
		},
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
		},
		{
			type: 'password',
			name: 'confirmPassword',
			id: 'confirmPassword',
			required: true,
			register: 'confirmPassword',
			label: 'Confirmer le mot de passe'
		}
	];
	const submitData = async (data: RegisterFormData) => {
		const { username, email, password } = data;
		try {
			await axios.post('http://localhost:8081/api/v1/auth/register', {
				username: username,
				email: email,
				password: password
			});
			router.push('/login');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(error.response);
			}
		}
	};

	return (
		<section className="register__container">
			<div className="form__card">
				<div className="home__link">
					<Link href="/">
						<FaAngleLeft /> <span>Revenir sur la carte</span>
					</Link>
				</div>
				<div className="form__title">
					<Image
						src="/images/FeLogo.png"
						width={70}
						height={70}
						alt="FuelEconomy logo"
						priority
					></Image>
					<h1>Inscription</h1>
				</div>

				<Form
					validationSchema={registerValidationSchema}
					onSubmit={submitData}
					formFields={formFields}
					labelButton="Créer son compte"
				></Form>

				<div className="form__link">
					<div>
						<span>Déjà un compte ?</span>
						<Link href="/login">Se connecter</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
