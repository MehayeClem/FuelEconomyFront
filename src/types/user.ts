export type UserProps = {
	username: string;
	email: string;
	password: string;
	gasStations: string[];
	createdAt: string;
	updatedAt: string;
};

export type UserPosition = {
	latitude: number;
	longitude: number;
};
