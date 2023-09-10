import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormData } from '../types/form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Form<T extends FieldValues>({
	validationSchema,
	onSubmit,
	formFields
}: FormData<T>) {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<T>({
		resolver: zodResolver(validationSchema)
	});

	const [passwordVisible, setPasswordVisible] = useState(false);

	function handleShowPassword() {
		setPasswordVisible(prevPasswordVisible => !prevPasswordVisible);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="form__content">
			{formFields.map(field => (
				<div key={field.id} className="input__container">
					{field.label && (
						<label htmlFor={field.id}> {field.label} </label>
					)}
					<div className="input__field">
						<input
							{...register(field.register)}
							type={!passwordVisible ? field.type : 'text'}
							name={field.name}
							id={field.id}
							required={field.required}
							placeholder={field.placeholder}
							readOnly={field.readonly}
							value={field.value}
						/>
						{field.type === 'password' && (
							<button type="button" onClick={handleShowPassword}>
								{' '}
								{passwordVisible ? <FaEye /> : <FaEyeSlash />}
							</button>
						)}
					</div>

					{errors[field.register] && (
						<div>{errors[field.register]?.message?.toString()}</div>
					)}
				</div>
			))}
			<div className="form__btn">
				<button>Connexion</button>
			</div>
		</form>
	);
}
