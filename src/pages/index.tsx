import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { FaMapLocationDot } from 'react-icons/fa6';
import { LatLngExpression } from 'leaflet';
import dynamic from 'next/dynamic';

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
	var userPos : GeolocationPosition;
	let userStation = [];
	let gasStation = [];
	var map;

	useEffect(() => {
		if (Cookies.get('refresh-token')) {
			toast.success('Bienvenu !');
		}
		console.log("coucou")
		getpos();
	}, []);

	function getpos()
	{
		navigator.geolocation.getCurrentPosition(savePos, () => {console.log('Erreur')}, {maximumAge : 1000});
	}

	function savePos(position)
	{
		userPos = position;
	}
	
	function initMap()
	{
		// L.mapquest.key = 'SP1kMeiC5ipl9Kqd3BvzCnlJSuccOWJo';
		L.mapquest.key = 'ck2OXUAJsF0iz999XGQ62jyXo8AXOVp7';
		
		// 'map' refers to a <div> element with the ID map
		map = L.mapquest.map('map', {
			center: [userPos.coords.latitude, userPos.coords.longitude],
			layers: L.mapquest.tileLayer('map'),
			zoom: 12
			});
		
		L.mapquest.textMarker([userPos.coords.latitude, userPos.coords.longitude], {
			text: "Moi",
			subtext: 'Ma position',
			position: 'right',
			type: 'marker',
			icon: {
			primaryColor: '#F63838',
			secondaryColor: '#949090',
			size: 'sm'
			}}).addTo(map);
	}

	async function getStation()
	{
		const response = await axios.get(
			`https://api.prix-carburants.2aaz.fr/stations/around/${userPos.coords.latitude},${userPos.coords.longitude}`
		);
		console.log(response);
		userStation = response.data;
	}
	
	async function getGasInfo()
	{
		for(let i = 0; i < userStation.length; i++)
		{
			try 
			{
			const response = await axios.get(
				`https://api.prix-carburants.2aaz.fr/station/${userStation[i].id}`
			);
			gasStation[i] = response.data;
		}catch{
				console.log('Erreur de demande d\'acces')
				return;
			}
		}
	}

	
	function addStationMap()
	{
		var pop = [];
		for(let i = 0; i < gasStation.length; i++)
		{
			pop[i] = L.popup('popupPane');
			let str = `<h2>${gasStation[i].name}</h2>\n`;
			for(let j = 0; j < gasStation[i].Fuels.length; j++)
			{
				str +=`<h3>${gasStation[i].Fuels[j].name}</h3>\n`;
				// console.log(str);
				str += `<p>Prix : ${gasStation[i].Fuels[j].Price.text} ${gasStation[i].Fuels[j].Price.currency}</p>\n`;
				// console.log(str);
			}
			pop[i].setContent(str);

			L.mapquest.textMarker([gasStation[i].Coordinates.latitude, gasStation[i].Coordinates.longitude], {
				text: gasStation[i].name,
				subtext: 'Station Essence',
				position: 'right',
				type: 'marker',
				icon: {
				primaryColor: '#333333',
				secondaryColor: '#333333',
				size: 'sm'
				}
			}).bindPopup(pop[i]).addTo(map);
		}
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
		<section className="home__container">
			<div className="search__container">
				<div className="search__controller">
					<div className="search__left">
						<div className="user__location">
							<FaMapLocationDot />
							Autour de moi
						</div>
					</div>
					<div className="search__right">
						<input
							type="search"
							name="searchBar"
							id="searchBar"
							placeholder="Rechercher par nom de station/carburant"
						/>
					</div>
				</div>
			</div>
			<div className="map__container">
				<Map center={mapCenter} zoom={zoom}></Map>
				<div className="map__infos"></div>
			</div>

			<div>
				<button className="button" onClick={() => initMap()}> Affiche Map</button>
			</div>

			<div>
				<button className="button" onClick={() => addStationMap()}> Affiche station sur MAP</button>
			</div>

			<div>
				<button className="button" onClick={() => getGasInfo()}> Bouton test</button>
			</div>

			<div id="map">
			</div>
		</>
	);
	}
