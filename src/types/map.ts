import { fullGasStationProps, gasStationProps } from './gasStation';

export type MapProps = {
	center: [number, number];
	zoom: number;
	gasStations: gasStationProps[];
	isLoading: boolean;
};
