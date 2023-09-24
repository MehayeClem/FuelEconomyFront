import React, { use, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { FaMapLocationDot } from 'react-icons/fa6';
import { LatLngExpression } from 'leaflet';
import dynamic from 'next/dynamic';

export default function Home() {
	const [mapCenter, setMapCenter] = useState<LatLngExpression>([
		46.603354, 1.888334
	]);
	const [zoom, setZoom] = useState<number>(6);

	const Map = dynamic(() => import('../components/map'), { ssr: false });

	return (
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
		</section>
	);
}
