import { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserPosition } from '../types/user';
import { gasStationProps } from '../types/gasStation';

export default function Home() {
	const GeoLocOptions = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 1000
	};

	const [userPosition, setUserPosition] = useState<UserPosition>();
	const [gasStations, setGasStations] = useState<gasStationProps[]>();

	useEffect(() => {
		getGeolocalisation();
		console.log(getStationsArroundData());
	}, [userPosition]);

	function getGeolocalisation() {
		navigator.geolocation.getCurrentPosition(
			position => {
				setUserPosition(position.coords);
			},
			() => {
				console.log('Erreur');
			},
			GeoLocOptions
		);
	}

	async function getStationsArroundData() {
		try {
			const response = await axios.get(
				`https://api.prix-carburants.2aaz.fr/stations/around/${userPosition?.latitude},${userPosition?.longitude}`
			);
			setGasStations(response.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					props: {
						errorMessage:
							error.response?.data.message || 'Une erreur est survenue'
					}
				};
			}
		}
	}

	return (
		<section>{gasStations?.map(gasStation => <div>Blabla</div>)}</section>
	);
}
