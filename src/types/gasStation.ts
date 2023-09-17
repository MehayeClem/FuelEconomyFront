export type gasStationProps = {
	address: {
		street_line: string;
		city_line: string;
	};
	brand: string;
	fuels: Fuelprops[];
};

export type Fuelprops = {
	name: string;
	price: string;
	available: boolean;
};
