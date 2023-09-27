import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios, { AxiosInstance } from 'axios';
import {
	FaAngleLeft,
	FaAngleRight,
	FaMagnifyingGlass,
	FaMapLocationDot
} from 'react-icons/fa6';
import { fullGasStationProps, gasStationProps } from '../types/gasStation';
import dynamic from 'next/dynamic';
import { CustomArrowProps } from 'react-slick';
import { CarouselSettingsProps } from '../types/caroussel';
import CarousselGasStation from '../components/carousselGasStations';
import createAxiosInstance from '../middlewares/axiosConfig';
import Cookies from 'js-cookie';

export default function Home() {
	const [mapCenter, setMapCenter] = useState<[number, number]>([
		46.603354, 1.888334
	]);
	const [mapZoom, setMapZoom] = useState<number>(6);
	const [gasStations, setGasStations] = useState<gasStationProps[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const savedMapZoom = localStorage.getItem('mapZoom');
		if (savedMapZoom) {
			setMapZoom(parseInt(savedMapZoom));
		}
		const savedMapCenter = localStorage.getItem('mapCenter');
		if (savedMapCenter) {
			setMapCenter(JSON.parse(savedMapCenter));
		}
		const savedGasStationsData = localStorage.getItem('gasStations');
		if (savedGasStationsData) {
			const parsedData = JSON.parse(savedGasStationsData);
			setGasStations(parsedData);
		}
	}, []);

	async function handleAroundGasStation() {
		navigator.geolocation.getCurrentPosition(async position => {
			const { latitude, longitude } = position.coords;
			setMapZoom(13);
			setMapCenter([latitude, longitude]);
			setIsLoading(true);

			localStorage.setItem('mapZoom', mapZoom.toString());
			localStorage.setItem(
				'mapCenter',
				JSON.stringify([latitude, longitude])
			);
			try {
				const response = await axios.get(
					`https://api.prix-carburants.2aaz.fr/stations/around/${latitude},${longitude}?responseFields=Fuels,Price`
				);

				const gasStationsData = response.data;

				const gasStationDetails = gasStationsData.map(
					(gasStationData: any) => {
						return {
							id: gasStationData.id,
							address: {
								street_line: gasStationData.Address.street_line,
								city_line: gasStationData.Address.city_line
							},
							brand: gasStationData.Brand.name,
							fuels: gasStationData.Fuels.map(
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
							lastUpdate: gasStationData.LastUpdate.value,
							latitude: gasStationData.Coordinates.latitude,
							longitude: gasStationData.Coordinates.longitude
						};
					}
				);

				// const firstBatch = gasStationsData.slice(0, 5);
				// const secondBatch = gasStationsData.slice(5);

				// const gasStationDetailsPromises = firstBatch.map(
				// 	async (gasStation: fullGasStationProps, index: number) => {
				// 		const delay = index * 500;
				// 		await new Promise(resolve => setTimeout(resolve, delay));
				// 		return getGasStationDetails(gasStation.id);
				// 	}
				// );

				// const gasStationDetailsFirstBatch = await Promise.all(
				// 	gasStationDetailsPromises
				// );

				// await new Promise(resolve => setTimeout(resolve, 10000));

				// const gasStationDetailsSecondBatchPromises = secondBatch.map(
				// 	async (gasStation: fullGasStationProps, index: number) => {
				// 		const delay = index * 500;
				// 		await new Promise(resolve => setTimeout(resolve, delay));
				// 		return getGasStationDetails(gasStation.id);
				// 	}
				// );

				// const gasStationDetailsSecondBatch = await Promise.all(
				// 	gasStationDetailsSecondBatchPromises
				// );

				// const gasStationDetails = gasStationDetailsFirstBatch.concat(
				// 	gasStationDetailsSecondBatch
				// );

				setGasStations(gasStationDetails);
				setIsLoading(false);
				localStorage.setItem(
					'gasStations',
					JSON.stringify(gasStationDetails)
				);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast.error(error.response?.data || 'Une erreur est survenue', {
						pauseOnHover: false,
						pauseOnFocusLoss: false
					});
				}
			}
		});
	}
	// async function getGasStationDetails(gasStationId: string) {
	// 	try {
	// 		const response = await axios.get(
	// 			`https://api.prix-carburants.2aaz.fr/station/${gasStationId}`
	// 		);
	// 		const gasStationDetails = response.data;
	// 		return {
	// 			id: gasStationDetails.id,
	// 			address: {
	// 				street_line: gasStationDetails.Address.street_line,
	// 				city_line: gasStationDetails.Address.city_line
	// 			},
	// 			brand: gasStationDetails.Brand.name,
	// 			fuels: gasStationDetails.Fuels.map(
	// 				(fuel: {
	// 					name: string;
	// 					Price: { text: string };
	// 					available: boolean;
	// 					short_name: string;
	// 					LastUpdate: {
	// 						value: string;
	// 					};
	// 				}) => ({
	// 					name: fuel.name,
	// 					price: fuel.Price.text,
	// 					available: fuel.available,
	// 					short_name: fuel.short_name
	// 				})
	// 			),
	// 			lastUpdate: gasStationDetails.LastUpdate.value,
	// 			latitude: gasStationDetails.Coordinates.latitude,
	// 			longitude: gasStationDetails.Coordinates.longitude
	// 		};
	// 	} catch (error) {
	// 		if (axios.isAxiosError(error)) {
	// 			toast.error(error.response?.data || 'Une erreur est survenue', {
	// 				pauseOnHover: false,
	// 				pauseOnFocusLoss: false
	// 			});
	// 		}
	// 	}
	// }

	const LeafletMap = dynamic(() => import('../components/leafletMap'), {
		ssr: false
	});

	const carrousselSettings: CarouselSettingsProps = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 1,
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

	async function saveGasStation(gasStationId: string) {
		const axiosInstance: AxiosInstance = createAxiosInstance();
		let user = null;

		if (Cookies.get('refreshToken')) {
			user = await axiosInstance.get('/users/me');
		}

		try {
			if (user) {
				const response = await axiosInstance.put(
					`/users/${user.data.user.id}/gasStations`,
					{
						gasStation: [gasStationId.toString()]
					}
				);
				console.log(response);

				toast.success(response.data, {
					pauseOnHover: false,
					pauseOnFocusLoss: false
				});
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data || 'Une erreur est survenue', {
					pauseOnHover: false,
					pauseOnFocusLoss: false
				});
			}
		}
	}

	async function searchGasStation() {
		setIsLoading(true);

		const filteredGasStations = gasStations.filter(
			(gasStationData: gasStationProps) => {
				return gasStationData.brand
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			}
		);

		setGasStations(filteredGasStations);
		setIsLoading(false);
	}

	return (
		<section className="home__container">
			<div className="search__container">
				<div className="search__controller">
					<div className="search__left">
						<div
							className={`user__location ${isLoading ? 'disabled' : ''}`}
							onClick={handleAroundGasStation}
						>
							{isLoading ? (
								<div className="button__loader__container">
									<span className="button__loader"></span>
								</div>
							) : (
								<>
									<FaMapLocationDot />
									Autour de moi
								</>
							)}
						</div>
					</div>
					<div className="search__right">
						<form
							onSubmit={e => {
								e.preventDefault();
								searchGasStation();
							}}
						>
							<input
								type="search"
								name="searchBar"
								id="searchBar"
								placeholder="Rechercher une station..."
								value={searchTerm}
								onChange={e => {
									setSearchTerm(e.target.value);
									if (e.target.value.trim() === '') {
										handleAroundGasStation();
									}
								}}
							/>
							<div className="search__icon" onClick={searchGasStation}>
								<FaMagnifyingGlass />
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className="map__container">
				<LeafletMap
					center={mapCenter}
					zoom={mapZoom}
					gasStations={gasStations}
					isLoading={isLoading}
				></LeafletMap>
				<div className="map__infos">
					{gasStations.length === 0 ? (
						<div>Aucune stations d'essences sur la carte</div>
					) : (
						<CarousselGasStation
							gasStationsData={gasStations}
							carrousselSettings={carrousselSettings}
							saveGasStation={saveGasStation}
						/>
					)}
				</div>
			</div>
		</section>
	);
}
