export type gasStationProps = {
	id: string;
	address: {
		street_line: string;
		city_line: string;
	};
	brand: string;
	fuels: Fuelprops[];
	lastUpdate: string;
	latitude: number;
	longitude: number;
};

export type Fuelprops = {
	name: string;
	price: string;
	available: boolean;
	short_name?: string;
};

export type fullGasStationProps = {
	id: string;
	distance: number;
	name: string;
	type: string;
	Distance: {
		value: number;
		text: string;
	};
	Coordinates: {
		latitude: number;
		longitude: number;
	};
	Brand: {
		id: number;
		name: string;
		nb_stations: number;
		short_name: string;
	};
	Address: {
		city_line: string;
		street_line: string;
	};
};
