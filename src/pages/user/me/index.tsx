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
	FaTrashCan,
	FaAngleRight,
	FaAngleLeft
} from 'react-icons/fa6';
import defaultAvatar from '../../../public/images/default_avatar.png';
import { useEffect, useState } from 'react';
import {
	formatDateToFrench,
	calculateTimeDifference
} from '../../../utils/date';
import Modal from '../../../components/modal';
import { ZodType, z } from 'zod';
import { InputFields, UpdateFormData } from '../../../types/form';
import CarousselGasStation from '../../../components/carousselGasStations';
import { CustomArrowProps } from 'react-slick';
import {
	CarouselSettingsProps,
	CarousselGasStationProps
} from '../../../types/caroussel';
import { useRouter } from 'next/router';

// export async function getServerSideProps(context: GetServerSidePropsContext) {
// 	const axiosInstance: AxiosInstance = createAxiosInstance(context);
// 	try {
// 		const user = await axiosInstance.get('/users/me');

// 		const userGasStations = user.data.user.gasStations;

// 		const gasStationsData = await Promise.all(
// 			userGasStations.map(async (gasStationId: string) => {
// 				try {
// 					const response = await axios.get(
// 						`https://api.prix-carburants.2aaz.fr/station/${gasStationId}`
// 					);

// 					const gasStationDetails = response.data;

// 					return {
// 						id: gasStationDetails.id,
// 						address: {
// 							street_line: gasStationDetails.Address.street_line,
// 							city_line: gasStationDetails.Address.city_line
// 						},
// 						brand: gasStationDetails.Brand.name,
// 						fuels: gasStationDetails.Fuels.map(
// 							(fuel: {
// 								name: string;
// 								Price: { text: string };
// 								available: boolean;
// 								short_name: string;
// 								LastUpdate: {
// 									value: string;
// 								};
// 							}) => ({
// 								name: fuel.name,
// 								price: fuel.Price.text,
// 								available: fuel.available,
// 								short_name: fuel.short_name
// 							})
// 						),
// 						lastUpdate: gasStationDetails.LastUpdate.value
// 					};
// 				} catch (error) {
// 					if (axios.isAxiosError(error)) {
// 						return {
// 							props: {
// 								errorMessage:
// 									error.response?.data.message ||
// 									'Une erreur est survenue'
// 							}
// 						};
// 					}
// 				}
// 			})
// 		);

// 		return {
// 			props: {
// 				user: user.data.user,
// 				gasStations: gasStationsData
// 			}
// 		};
// 	} catch (error) {
// 		if (axios.isAxiosError(error)) {
// 			return {
// 				props: {
// 					errorMessage: error.response?.data || 'Une erreur est survenue'
// 				}
// 			};
// 		} else {
// 			return {
// 				props: {
// 					errorMessage: 'Une erreur est survenue'
// 				}
// 			};
// 		}
// 	}
// }

export default function Profil() {
	const router = useRouter();
	const [userData, setUserData] = useState<UserProps>({
		id: '',
		username: '',
		email: '',
		password: '',
		gasStations: [],
		createdAt: '',
		updatedAt: ''
	});
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [gasStationsData, setGasStationData] = useState<gasStationProps[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('isConnected') != 'true') {
			router.push('/');
			toast.error("Vous n'êtes pas connecté", {
				pauseOnHover: false,
				pauseOnFocusLoss: false
			});
		}
		async function getUserData() {
			const axiosInstance: AxiosInstance = createAxiosInstance();
			try {
				const user = await axiosInstance.get('/users/me');

				const userGasStations = user.data.user.gasStations;

				setUserData(user.data.user);

				const gasStationsData: gasStationProps[] = await Promise.all(
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
								const errorMessage =
									error.response?.data || 'Une erreur est survenue';
								toast.error(errorMessage.toString(), {
									pauseOnHover: false,
									pauseOnFocusLoss: false
								});
							}
						}
					})
				);
				setGasStationData(gasStationsData);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					const errorMessage =
						error.response?.data || 'Une erreur est survenue';
					toast.error(errorMessage.toString(), {
						pauseOnHover: false,
						pauseOnFocusLoss: false
					});
				}
			}
		}
		getUserData();
	}, []);

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

	const carrousselSettings: CarouselSettingsProps = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 2,
		slidesToScroll: 1,
		initialSlide: 0,
		rows: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: false,
					dots: false
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: false
				}
			}
		],
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />
	};

	function CustomPrevArrow({ onClick }: CustomArrowProps) {
		return (
			<div className="custom__arrow prev__arrow" onClick={onClick}>
				<div>
					<FaAngleLeft />
				</div>
			</div>
		);
	}

	function CustomNextArrow({ onClick }: CustomArrowProps) {
		return (
			<div className="custom__arrow next__arrow" onClick={onClick}>
				<div>
					<FaAngleRight />
				</div>
			</div>
		);
	}

	async function deleteGasStation(gasStationId: string) {
		const axiosInstance: AxiosInstance = createAxiosInstance();

		try {
			const response = await axiosInstance.delete(
				`/users/${userData.id}/gasStations`,
				{
					data: {
						gasStations: [gasStationId.toString()]
					}
				}
			);

			setGasStationData(prevGasStations =>
				prevGasStations.filter(gasStation => gasStation.id !== gasStationId)
			);

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

		const userDataUpdate: UpdateFormData = {};

		if (data.email != '') {
			userDataUpdate.email = data.email;
		}

		if (data.username != '') {
			userDataUpdate.username = data.username;
		}

		if (data.email == '' && data.username == '') {
			toast.error('Les champs ne doivent pas être vide', {
				pauseOnHover: false,
				pauseOnFocusLoss: false
			});
			return;
		}

		try {
			const newUserData = await axiosInstance.put(`/users/${userData.id}`, {
				data: {
					username: userDataUpdate?.username,
					email: userDataUpdate?.email
				}
			});

			setUserData(newUserData.data.user);

			toast.success(newUserData.data.message, {
				pauseOnHover: false,
				pauseOnFocusLoss: false
			});

			setIsModalOpen(false);
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data || 'Une erreur est survenue', {
					pauseOnHover: false,
					pauseOnFocusLoss: false
				});
			}
		}
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

			{userData ? (
				<div className="profil__wrapper">
					<div className="profil__details">
						<div className="profil__top">
							<div className="profil__img">
								<Image
									src="/images/default_avatar.png"
									width={150}
									height={150}
									alt="Image de profil"
									priority
								></Image>
							</div>

							<div className="profil__settings">
								<div className="profil__edit" onClick={openModal}>
									<FaPencil />
								</div>
							</div>
						</div>
						<div className="profil__bottom">
							<div className="profil__username">
								<h1>{userData.username}</h1>
								<span className="profil__account">
									Compte créé le{' '}
									{formatDateToFrench(userData.createdAt)}{' '}
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
								<div>Aucunes stations d'essences favorites</div>
							) : (
								<CarousselGasStation
									gasStationsData={gasStationsData}
									deleteGasStation={deleteGasStation}
									carrousselSettings={carrousselSettings}
								/>
							)}
						</div>
					</div>
				</div>
			) : (
				<div>Erreur pendant la récupération de l'utilisateur</div>
			)}
		</section>
	);
}
