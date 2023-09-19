export type gasStationProps = {
	id: string;
	address: {
		street_line: string;
		city_line: string;
	};
	brand: string;
	fuels: Fuelprops[];
	lastUpdate: string;
};

export type Fuelprops = {
	name: string;
	price: string;
	available: boolean;
	short_name?: string;
};
