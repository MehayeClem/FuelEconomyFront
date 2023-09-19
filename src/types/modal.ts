import { ZodSchema } from 'zod';
import { FormData, InputFields } from './form';
import { FieldValues, SubmitHandler } from 'react-hook-form';

export type ModalProps<T extends FieldValues> = {
	onClose: () => void;
	validationSchema?: ZodSchema;
	onSubmit?: SubmitHandler<T>;
	formFields?: InputFields<T>[];
	labelButton?: string;
};
