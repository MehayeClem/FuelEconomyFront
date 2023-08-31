import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormData } from '../types/form';

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

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{formFields.map(field => (
				<div key={field.id}>
					{field.label && (
						<label htmlFor={field.id}> {field.label} </label>
					)}
					<input
						{...register(field.register)}
						type={field.type}
						name={field.name}
						id={field.id}
						required={field.required}
						placeholder={field.placeholder}
						readOnly={field.readonly}
						value={field.value}
					/>
					{errors[field.register] && (
						<span>{errors[field.register]?.message?.toString()}</span>
					)}
				</div>
			))}
			<button>Submit</button>
		</form>
	);
}
