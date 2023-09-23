import { ZodSchema } from 'zod';
import { FieldValues, Path, SubmitHandler } from 'react-hook-form';

export type FormData<T extends FieldValues> = {
	validationSchema: ZodSchema;
	onSubmit: SubmitHandler<T>;
	formFields: InputFields<T>[];
	labelButton: string;
};

export type InputFields<T> = {
	type: string;
	name: string;
	id: string;
	placeholder?: string;
	label?: string;
	required?: boolean;
	readonly?: boolean;
	value?: string;
	register: Path<T>;
};

export type RegisterFormData = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export type LoginFormData = {
	email: string;
	password: string;
};

export type UpdateFormData = {
	email?: string;
	username?: string;
};
