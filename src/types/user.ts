export type UserProps = {
	id?: string;
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
