import { Prediction } from "@/models";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "mysql",
	host: process.env.MYSQL_HOST,
	username: process.env.MYSQL_USER,
	database: process.env.MYSQL_DATABASE,
	password: process.env.MYSQL_PASWORD,
	port: Number(process.env.MYSQL_PORT),
	// logging: true,
	entities: [Prediction],
	// synchronize: true,
	// subscribers: [],
	// migrations: [],
});

export const connect = async () => {
	try {
		await AppDataSource.initialize();
		console.log("DB conected");
	} catch (error) {
		console.log(error);
	}
};

export const desconect = async () => {
	try {
		await AppDataSource.destroy();
		console.log("DB disconected");
	} catch (error) {
		console.log(error);
	}
};
