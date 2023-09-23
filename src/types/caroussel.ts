import { gasStationProps } from './gasStation';

export type CarousselGasStationProps = {
	gasStationsData: gasStationProps[];
	deleteGasStation: (gasStationId: string) => void;
};
