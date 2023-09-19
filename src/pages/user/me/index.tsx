import axios, { AxiosInstance, isAxiosError } from 'axios';
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
	FaTrashCan
} from 'react-icons/fa6';
import defaultAvatar from '../../../public/images/default_avatar.png';
import { useState } from 'react';
import {
	formatDateToFrench,
	calculateTimeDifference
} from '../../../utils/date';
import Modal from '../../../components/modal';
import { ZodType, z } from 'zod';
import { InputFields, UpdateFormData } from '../../../types/form';

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
						id: gasStationDetails.id,
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
	const [userData, setUserData] = useState<UserProps>(user);
	const [gasStationsData, setGasStationData] =
		useState<gasStationProps[]>(gasStations);
	const [isModalOpen, setIsModalOpen] = useState(false);

	toast.error(errorMessage, {
		pauseOnHover: false,
		pauseOnFocusLoss: false
	});

	const updateValidationSchema: ZodType<UpdateFormData> = z.object({
		email: z
			.string()
			.email({ message: 'Mauvaise adresse mail' })
			.optional()
			.or(z.literal('')),
		username: z
			.string()
			.min(3, {
				message: "Le nom d'utilisateur doit comporter au moins 3 caractères"
			})
			.max(20, {
				message:
					"Le nom d'utilisateur doit comporter au maximum 20 caractères"
			})
			.optional()
			.or(z.literal(''))
	});

	const formFields: InputFields<UpdateFormData>[] = [
		{
			type: 'text',
			name: 'username',
			id: 'username',
			register: 'username',
			label: 'Pseudo'
		},
		{
			type: 'email',
			name: 'email',
			id: 'email',
			register: 'email',
			label: 'Email'
		}
	];

	async function deleteGasStation(gasStationId: string) {
		const axiosInstance: AxiosInstance = createAxiosInstance();

		try {
			const response = await axiosInstance.delete(
				`/users/${user.id}/gasStations`,
				{
					data: {
						gasStations: [gasStationId.toString()]
					}
				}
			);

			setGasStationData(response.data.gasStations);

			toast.success(response.data.message, {
				pauseOnHover: false,
				pauseOnFocusLoss: false
			});
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data || 'Une erreur est survenue', {
					pauseOnHover: false,
					pauseOnFocusLoss: false
				});
			}
		}
	}

	async function updateUser(data: UpdateFormData) {
		const axiosInstance: AxiosInstance = createAxiosInstance();

		const userData: UpdateFormData = {};

		if (data.email != '') {
			userData.email = data.email;
		}

		if (data.username != '') {
			userData.username = data.username;
		}

		try {
			const newUserData = await axiosInstance.put(`/users/${user.id}`, {
				data: {
					username: userData?.username,
					email: userData?.email
				}
			});

			setUserData(newUserData.data.user);

			toast.success(newUserData.data.message, {
				pauseOnHover: false,
				pauseOnFocusLoss: false
			});

			setIsModalOpen(false);
		} catch (error) {}
		console.log(data);
	}

	function openModal() {
		setIsModalOpen(true);
	}

	function closeModal() {
		setIsModalOpen(false);
	}

	return (
		<section className="profil__container">
			{isModalOpen && (
				<Modal
					validationSchema={updateValidationSchema}
					formFields={formFields}
					onSubmit={updateUser}
					labelButton="Enregistrer"
					onClose={closeModal}
				/>
			)}
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
							<div className="profil__edit" onClick={openModal}>
								<FaPencil />
							</div>
							<div className="profil__theme">
								<ThemeSwitcher />
							</div>
						</div>
					</div>
					<div className="profil__bottom">
						<div className="profil__username">
							<h1>{userData.username}</h1>
							<span className="profil__account">
								Compte créé le {formatDateToFrench(userData.createdAt)}{' '}
							</span>
						</div>
						<div className="profil__infos">
							<ul className="profil__list">
								<li className="profil__info">
									<FaEnvelope />
									{userData.email}
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="gasStations__container">
					<h1>Mes stations favorites</h1>
					<div className="gasStations__details">
						{gasStationsData.length === 0 ? (
							<div>Aucune stations d'essences favorites</div>
						) : (
							gasStationsData.map((gasStation, index) => (
								<div key={index} className="gasStation__card">
									<div
										className="card__delete"
										onClick={() => {
											deleteGasStation(gasStation.id);
										}}
									>
										<FaTrashCan />
									</div>
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

														<div
															className={`fuel__available fuel__available-${fuel.available}`}
														>
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
							))
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
