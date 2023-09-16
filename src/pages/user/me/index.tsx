import axios, { AxiosInstance } from 'axios';
import { UserProps } from '../../../types/user';
import { toast } from 'react-toastify';
import axiosInstance from '../../../middlewares/axiosConfig';
import { GetServerSidePropsContext } from 'next';
import createAxiosInstance from '../../../middlewares/axiosConfig';

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const axiosInstance: AxiosInstance = createAxiosInstance(context);
	try {
		const user = await axiosInstance.get('/users/me');

		return {
			props: {
				user: user.data
			}
		};
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return {
				props: {
					user: {},
					errorMessage: error.response?.data || 'Une erreur est survenue'
				}
			};
		} else {
			return {
				props: {
					user: {},
					errorMessage: 'Une erreur est survenue'
				}
			};
		}
	}
}

type ProfilePageProps = {
	user: UserProps;
	errorMessage: string;
};

function Profil({
	user,
	errorMessage
}: {
	user: UserProps;
	errorMessage: string;
}) {
	toast.error(errorMessage, {
		pauseOnHover: false
	});

	return <h1>Hello</h1>;
}

export default Profil;
