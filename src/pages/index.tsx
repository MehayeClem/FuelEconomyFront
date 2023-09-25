import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaMapLocationDot, FaS, FaSpinner } from 'react-icons/fa6';
import { fullGasStationProps, gasStationProps } from '../types/gasStation';
import dynamic from 'next/dynamic';

export default function Home() {
	const [mapCenter, setMapCenter] = useState<[number, number]>([
		46.603354, 1.888334
	]);
	const [mapZoom, setMapZoom] = useState<number>(6);
	const [gasStations, setGasStations] = useState<gasStationProps[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	async function handleAroundGasStation() {
		navigator.geolocation.getCurrentPosition(async position => {
			const { latitude, longitude } = position.coords;
			setMapZoom(13);
			setMapCenter([latitude, longitude]);
			setIsLoading(true);
			try {
				const response = await axios.get(
					`https://api.prix-carburants.2aaz.fr/stations/around/${latitude},${longitude}`
				);

				const gasStationsData = response.data;

				const firstBatch = gasStationsData.slice(0, 5);
				const secondBatch = gasStationsData.slice(5);

				const gasStationDetailsPromises = firstBatch.map(
					async (gasStation: fullGasStationProps, index: number) => {
						const delay = index * 500;
						await new Promise(resolve => setTimeout(resolve, delay));
						return getGasStationDetails(gasStation.id);
					}
				);

				const gasStationDetailsFirstBatch = await Promise.all(
					gasStationDetailsPromises
				);

				await new Promise(resolve => setTimeout(resolve, 10000));

				const gasStationDetailsSecondBatchPromises = secondBatch.map(
					async (gasStation: fullGasStationProps, index: number) => {
						const delay = index * 500;
						await new Promise(resolve => setTimeout(resolve, delay));
						return getGasStationDetails(gasStation.id);
					}
				);

				const gasStationDetailsSecondBatch = await Promise.all(
					gasStationDetailsSecondBatchPromises
				);

				const gasStationDetails = gasStationDetailsFirstBatch.concat(
					gasStationDetailsSecondBatch
				);

				setGasStations(gasStationDetails);
				setIsLoading(false);
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
	async function getGasStationDetails(gasStationId: string) {
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
				lastUpdate: gasStationDetails.LastUpdate.value,
				latitude: gasStationDetails.Coordinates.latitude,
				longitude: gasStationDetails.Coordinates.longitude
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data || 'Une erreur est survenue', {
					pauseOnHover: false,
					pauseOnFocusLoss: false
				});
			}
		}
	}

	const LeafletMap = dynamic(() => import('../components/leafletMap'), {
		ssr: false
	});

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
						<input
							type="search"
							name="searchBar"
							id="searchBar"
							placeholder="Rechercher une station..."
						/>
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
				<div className="map__infos"></div>
			</div>
		</section>
	);
}
