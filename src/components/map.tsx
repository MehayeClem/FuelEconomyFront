import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { MapProps } from '../types/map';

export default function Map({ center, zoom }: MapProps) {
	return (
		<MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
		</MapContainer>
	);
}
