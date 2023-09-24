import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Fuel {
  name: string;
  Price: {
    text: string;
    currency: string;
  };
}

interface GasStation {
  id: string;
  name: string;
  Fuels: Fuel[];
  Coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function Home() {
  const [userPosition, setUserPosition] = useState<GeolocationPosition | null>(null);
  const [nearbyStations, setNearbyStations] = useState<GasStation[]>([]);
  const [stationDetails, setStationDetails] = useState<GasStation[]>([]);
  const [mapInstance, setMapInstance] = useState<any | null>(null);

  useEffect(() => {
    if (Cookies.get('refresh-token')) {
      toast.success('Bienvenue !');
    }
  }, []);

  function fetchUserPosition() {
    navigator.geolocation.getCurrentPosition(setUserPosition, () => console.log('Erreur lors de la récupération de la position'), { maximumAge: 1000 });
  }

  function initializeMap() {
    if (!userPosition) return;
    
    L.mapquest.key = 'ck2OXUAJsF0iz999XGQ62jyXo8AXOVp7';
    
	if (map){
		map.remove();
	}
    const map = L.mapquest.map('map', {
      center: [userPosition.coords.latitude, userPosition.coords.longitude],
      layers: L.mapquest.tileLayer('map'),
      zoom: 12
    });

    L.mapquest.textMarker([userPosition.coords.latitude, userPosition.coords.longitude], {
      text: "Moi",
      subtext: 'Ma position',
      position: 'right',
      type: 'marker',
      icon: {
        primaryColor: '#F63838',
        secondaryColor: '#949090',
        size: 'sm'
      }
    }).addTo(map);

    setMapInstance(map);
  }

  async function fetchNearbyStations() {
    if (!userPosition) return;

    try {
      const response = await axios.get(`https://api.prix-carburants.2aaz.fr/stations/around/${userPosition.coords.latitude},${userPosition.coords.longitude}`);
      setNearbyStations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des stations", error);
    }
  }

  async function fetchStationDetails() {
    const details = [];
    for (let station of nearbyStations) {
      try {
        const response = await axios.get(`https://api.prix-carburants.2aaz.fr/station/${station.id}`);
        details.push(response.data);
      } catch (error) {
        console.error('Erreur lors de la demande d\'acces aux détails de la station', error);
        return;
      }
    }
    setStationDetails(details);
  }

  function displayStationsOnMap() {
    if (!mapInstance) return;
    stationDetails.forEach((station) => {
      const popupContent = generatePopupContent(station);
      const popup = L.popup('popupPane').setContent(popupContent);
      L.mapquest.textMarker([station.Coordinates.latitude, station.Coordinates.longitude], {
        text: station.name,
        subtext: 'Station Essence',
        position: 'right',
        type: 'marker',
        icon: {
          primaryColor: '#333333',
          secondaryColor: '#333333',
          size: 'sm'
        }
      }).bindPopup(popup).addTo(mapInstance);
    });
  }

  function generatePopupContent(station: GasStation): string {
    let content = `<h2>${station.name}</h2>\n`;
    station.Fuels.forEach((fuel) => {
      content += `<h3>${fuel.name}</h3>\n<p>Prix : ${fuel.Price.text} ${fuel.Price.currency}</p>\n`;
    });
    return content;
  }

	return (
		<>

		<div>
			<button className='button' onClick={()=> fetchUserPosition()}>userPosition</button>
		</div>
		<div>
			<button className='button' onClick={()=> initializeMap()}>initMap</button>
		</div>

			{
			
			/* <div>
				<button className="button" onClick={() => getStation()}> Get station aroud me</button>
			</div>

			<div>
				<button className="button" onClick={() => getGasInfo()}> Get gas Info</button>
			</div>
			
			<div>
				<button className="button" onClick={() => console.log(userStation)}> Print station</button>
			</div>

			<div>
				<button className="button" onClick={() => console.log(gasStation)}> Print gas per station</button>
			</div>

			<div>
				<button className="button" onClick={() => initializeMap()}> Affiche Map</button>
			</div>

			<div>
				<button className="button" onClick={() => addStationMap()}> Affiche station sur MAP</button>
			</div>

			<div>
				<button className="button" onClick={() => getGasInfo()}> Bouton test</button>
			</div> */}

			<div id="map">
			</div>
		</>
	);
	}
