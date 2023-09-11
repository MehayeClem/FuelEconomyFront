import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormData } from '../types/form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Form<T extends FieldValues>({
	validationSchema,
	onSubmit,
	formFields,
	labelButton
}: FormData<T>) {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<T>({
		resolver: zodResolver(validationSchema)
	});

	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	function handleShowPassword() {
		setPasswordVisible(prevPasswordVisible => !prevPasswordVisible);
	}

	function handleShowConfirmPassword() {
		setConfirmPasswordVisible(
			prevConfirmPasswordVisible => !prevConfirmPasswordVisible
		);
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
							type={
								field.name === 'password'
									? passwordVisible
										? 'text'
										: 'password'
									: field.name === 'confirmPassword'
									? confirmPasswordVisible
										? 'text'
										: 'password'
									: field.type
							}
							name={field.name}
							id={field.id}
							required={field.required}
							placeholder={field.placeholder}
							readOnly={field.readonly}
							value={field.value}
						/>
						{field.name === 'password' && (
							<button type="button" onClick={handleShowPassword}>
								{' '}
								{passwordVisible ? <FaEye /> : <FaEyeSlash />}
							</button>
						)}
						{field.name === 'confirmPassword' && (
							<button type="button" onClick={handleShowConfirmPassword}>
								{' '}
								{confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
							</button>
						)}
					</div>

					{errors[field.register] && (
						<div className="form__error">
							{errors[field.register]?.message?.toString()}
						</div>
					)}
				</div>
			))}
			<div className="form__btn">
				<button>{labelButton}</button>
			</div>
		</form>
	);
}
