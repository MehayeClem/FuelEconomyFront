import axios, { AxiosInstance } from 'axios';
import { UserProps } from '../../../types/user';
import { toast } from 'react-toastify';
import { GetServerSidePropsContext } from 'next';
import createAxiosInstance from '../../../middlewares/axiosConfig';
import { gasStationProps } from '../../../types/gasStation';
import ThemeSwitcher from '../../../components/switchTheme';
import Image from 'next/image';
import {
	FaPencil,
	FaEnvelope,
	FaRegCircleXmark,
	FaRegCircleCheck,
	FaLocationDot
} from 'react-icons/fa6';
import defaultAvatar from '../../../public/images/default_avatar.png';

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
								short_name: string;
								LastUpdate: {
									value: string;
								};
							}) => ({
								name: fuel.name,
								price: fuel.Price.text,
								available: fuel.available,
								short_name: fuel.short_name
							})
						),
						lastUpdate: gasStationDetails.LastUpdate.value
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

	function calculateTimeDifference(lastUpdate: string): string {
		const lastUpdateDate = new Date(lastUpdate);
		const currentDate = new Date();

		const timeDifferenceMilliseconds =
			currentDate.getTime() - lastUpdateDate.getTime();

		const secondsDifference = Math.floor(timeDifferenceMilliseconds / 1000);
		const minutesDifference = Math.floor(secondsDifference / 60);
		const hoursDifference = Math.floor(minutesDifference / 60);
		const daysDifference = Math.floor(hoursDifference / 24);

		if (daysDifference >= 1) {
			return `Dernière mise à jour il y a ${daysDifference} jour${
				daysDifference !== 1 ? 's' : ''
			}`;
		} else if (hoursDifference >= 1) {
			return `Dernière mise à jour il y a ${hoursDifference} heure${
				hoursDifference !== 1 ? 's' : ''
			}`;
		} else if (minutesDifference >= 1) {
			return `Dernière mise à jour il y a ${minutesDifference} minute${
				minutesDifference !== 1 ? 's' : ''
			}`;
		} else {
			return `Dernière mise à jour il y a ${secondsDifference} seconde${
				secondsDifference !== 1 ? 's' : ''
			}`;
		}
	}

	return (
		<section className="profil__container">
			<div className="profil__wrapper">
				<div className="profil__details">
					<div className="profil__top">
						<div className="profil__img">
							<Image
								src={defaultAvatar}
								alt="Image de profil"
								priority
							></Image>
						</div>

						<div className="profil__settings">
							<div className="profil__edit">
								<FaPencil />
							</div>
							<div className="profil__theme">
								<ThemeSwitcher />
							</div>
						</div>
					</div>
					<div className="profil__bottom">
						<div className="profil__username">
							<h1>{user.username}</h1>
							<span className="profil__account">
								Compte créé le {formatDateToFrench(user.createdAt)}{' '}
							</span>
						</div>
						<div className="profil__infos">
							<ul className="profil__list">
								<li className="profil__info">
									<FaEnvelope />
									{user.email}
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="gasStations__container">
					<h1>Mes stations favorites</h1>
					<div className="gasStations__details">
						{gasStations.map((gasStation, index) => (
							<div key={index} className="gasStation__card">
								<div className="card__top">
									<div className="card__left">
										<h2>{gasStation.brand}</h2>

										<span>
											{gasStation.address.street_line},{' '}
											{gasStation.address.city_line}
										</span>
									</div>
									<div className="card__right">
										<ul>
											{gasStation.fuels.map((fuel, fuelIndex) => (
												<li
													key={fuelIndex}
													className="fuel__details"
												>
													<div className="fuel__infos">
														<div className="fuel__name">
															{fuel.short_name}
														</div>
														<div className="fuel__price">
															{fuel.price}
														</div>
													</div>

													<div className="fuel__available">
														{fuel.available ? (
															<FaRegCircleCheck />
														) : (
															<FaRegCircleXmark />
														)}
													</div>
												</li>
											))}
										</ul>
									</div>
								</div>
								<div className="card__bottom">
									{calculateTimeDifference(gasStation.lastUpdate)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
