'use client';

import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import GasStationMarker from '../public/images/GasStationMarker.png';
import UserMarker from '../public/images/UserMarker.png';
import MarkerShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MapProps } from '../types/map';
import { FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import { calculateTimeDifference } from '../utils/date';

export default function LeafletMap({
	center,
	zoom,
	gasStations,
	isLoading
}: MapProps) {
	return (
		<>
			{isLoading ? (
				<div className="map__loader__container">
					<span className="map__loader"></span>
				</div>
			) : (
				<MapContainer center={center} zoom={zoom}>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					<Marker
						icon={
							new L.Icon({
								iconUrl: UserMarker.src,
								iconRetinaUrl: UserMarker.src,
								iconSize: [48, 48],
								iconAnchor: [26, 48],
								tooltipAnchor: [16, -32],
								popupAnchor: [0, -32],
								shadowUrl: MarkerShadow.src,
								shadowSize: [48, 48],
								shadowAnchor: [16, 48]
							})
						}
						position={center}
					>
						<Tooltip>Vous êtes ici</Tooltip>
					</Marker>

					{gasStations &&
						gasStations.map(gasStation => (
							<Marker
								key={gasStation.id}
								icon={
									new L.Icon({
										iconUrl: GasStationMarker.src,
										iconRetinaUrl: GasStationMarker.src,
										iconSize: [48, 48],
										iconAnchor: [26, 48],
										popupAnchor: [0, -48],
										shadowUrl: MarkerShadow.src,
										shadowSize: [48, 48],
										shadowAnchor: [25, 48]
									})
								}
								position={[gasStation.latitude, gasStation.longitude]}
							>
								<Popup>
									<div className="popup__container">
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
													{gasStation.fuels.map(
														(fuel, fuelIndex) => (
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
														)
													)}
												</ul>
											</div>
										</div>
										<div className="card__bottom">
											{calculateTimeDifference(
												gasStation.lastUpdate
											)}
										</div>
									</div>
								</Popup>
							</Marker>
						))}
				</MapContainer>
			)}
		</>
	);
}
