import Form from './form';
import { FaXmark } from 'react-icons/fa6';
import { ModalProps } from '../types/modal';
import { FieldValues } from 'react-hook-form';

export default function Modal<T extends FieldValues>({
	validationSchema,
	onSubmit,
	formFields,
	labelButton,
	onClose
}: ModalProps<T>) {
	return (
		<div className="modal__container">
			<div className="modal__wrapper">
				<div className="modal__close" onClick={onClose}>
					<FaXmark />
				</div>
				<h2>Modifier son compte</h2>
				{validationSchema && onSubmit && formFields && labelButton && (
					<Form
						validationSchema={validationSchema}
						onSubmit={onSubmit}
						formFields={formFields}
						labelButton={labelButton}
					/>
				)}
			</div>
		</div>
	);
}
