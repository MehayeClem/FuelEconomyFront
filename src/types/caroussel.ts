import { gasStationProps } from './gasStation';

export type CarousselGasStationProps = {
	gasStationsData: gasStationProps[];
	deleteGasStation?: (gasStationId: string) => void;
	carrousselSettings: CarouselSettingsProps;
};

type CustomArrowProps = {
	onClick?: () => void;
};

// Définir un type pour la configuration du carrousel
export type CarouselSettingsProps = {
	dots: boolean;
	infinite: boolean;
	speed: number;
	slidesToShow: number;
	slidesToScroll: number;
	initialSlide: number;
	rows?: number;
	centerMode?: boolean;
	className?: string;
	centerPadding?: string;
	responsive: {
		breakpoint: number;
		settings: {
			slidesToShow: number;
			slidesToScroll: number;
			infinite?: boolean;
			dots?: boolean;
		};
	}[];
	prevArrow: React.ReactElement<CustomArrowProps>;
	nextArrow: React.ReactElement<CustomArrowProps>;
};
