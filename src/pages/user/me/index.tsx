import axios, { AxiosInstance } from 'axios';
import { UserProps } from '../../../types/user';
import { toast } from 'react-toastify';
import { GetServerSidePropsContext } from 'next';
import createAxiosInstance from '../../../middlewares/axiosConfig';
import { gasStationProps } from '../../../types/gasStation';
import ThemeSwitcher from '../../../components/switchTheme';

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const axiosInstance: AxiosInstance = createAxiosInstance(context);
	try {
		const user = await axiosInstance.get('/users/me');

		const userGasStations = user.data.user.gasStations;

		const gasStationsData = await Promise.all(
			userGasStations.map(async (gasStationId: string) => {
				try {
					const response = await axios.get(
						`https://api.prix-carburants.2aaz.fr/station/${gasStationId}`
					);

					const gasStationDetails = response.data;
					return {
						address: {
							street_line: gasStationDetails.Address.street_line,
							city_line: gasStationDetails.Address.city_line
						},
						brand: gasStationDetails.Brand.name,
						fuels: gasStationDetails.Fuels.map(
							(fuel: {
								name: string;
								Price: { text: string };
								available: boolean;
							}) => ({
								name: fuel.name,
								price: fuel.Price.text,
								available: fuel.available
							})
						)
					};
				} catch (error) {
					if (axios.isAxiosError(error)) {
						return {
							props: {
								errorMessage:
									error.response?.data.message ||
									'Une erreur est survenue'
							}
						};
					}
				}
			})
		);

		return {
			props: {
				user: user.data.user,
				gasStations: gasStationsData
			}
		};
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return {
				props: {
					errorMessage: error.response?.data || 'Une erreur est survenue'
				}
			};
		} else {
			return {
				props: {
					errorMessage: 'Une erreur est survenue'
				}
			};
		}
	}
}

export default function Profil({
	user,
	errorMessage,
	gasStations
}: {
	user: UserProps;
	errorMessage: string;
	gasStations: gasStationProps[];
}) {
	toast.error(errorMessage, {
		pauseOnHover: false
	});

	function formatDateToFrench(userDate: string): string {
		const date = new Date(userDate);
		const options: Intl.DateTimeFormatOptions = {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		};

		return date.toLocaleDateString('fr-FR', options);
	}

	console.log(gasStations);

	return (
		<section className="profil__container">
			<div className="profil__wrapper">
				<div className="profil__details">
					<div className="profil__top">
						<div className="profil__img">Image</div>
						<div className="profil__edit">Edit</div>
					</div>
					<div className="profil__bottom">
						<p>{user.username}</p>
						<p>{formatDateToFrench(user.createdAt)}</p>
						<p>{user.email}</p>
					</div>
				</div>
				<div className="settings__container">
					<ThemeSwitcher />
				</div>
			</div>

			<div className="gasSations__container">
				{gasStations.map((gasStation, index) => (
					<div key={index}>
						<h2>{gasStation.brand}</h2>
						<p>Street Line: {gasStation.address.street_line}</p>
						<p>City Line: {gasStation.address.city_line}</p>
						<h3>Fuels:</h3>
						<ul>
							{gasStation.fuels.map((fuel, fuelIndex) => (
								<li key={fuelIndex}>
									<strong>Name:</strong> {fuel.name}
									<br />
									<strong>Price:</strong> {fuel.price}
									<br />
									{fuel.available ? 'Disponible' : 'Indisponible'}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
}
