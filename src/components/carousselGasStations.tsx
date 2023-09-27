import Slider, { CustomArrowProps } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CarousselGasStationProps } from '../types/caroussel';
import {
	FaAngleLeft,
	FaAngleRight,
	FaRegCircleCheck,
	FaRegCircleXmark,
	FaTrashCan
} from 'react-icons/fa6';
import { calculateTimeDifference } from '../utils/date';

export default function CarousselGasStation({
	gasStationsData,
	deleteGasStation,
	carrousselSettings
}: CarousselGasStationProps) {
	return (
		<Slider {...carrousselSettings}>
			{gasStationsData.map((gasStation, index) => (
				<div key={index} className="gasStation__card">
					{deleteGasStation && (
						<div
							className="card__delete"
							onClick={() => {
								deleteGasStation(gasStation.id);
							}}
						>
							<FaTrashCan />
						</div>
					)}
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
									<li key={fuelIndex} className="fuel__details">
										<div className="fuel__infos">
											<div className="fuel__name">
												{fuel.short_name}
											</div>
											<div className="fuel__price">{fuel.price}</div>
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
			))}
		</Slider>
	);
}
