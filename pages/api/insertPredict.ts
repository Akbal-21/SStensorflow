/* eslint-disable import/no-anonymous-default-export */
import { db } from "@/database";
import { Prediction } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	message: string;
};

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "POST":
			return insertPredictions(req, res);

		default:
			return res.status(400).json({ message: "Bad request" });
	}
}

async function insertPredictions(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	console.log(req.body);

	const {
		// srcImg,
		predict3,
	} = req.body as {
		// srcImg: string;
		predict3: string;
	};

	const predictio = new Prediction();
	// predictio.srcImg = srcImg;
	predictio.predict = predict3;

	console.log({ predictio });

	try {
		await db.connect();
		await predictio.save();
		await db.desconect();
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: error.message });
		}
	}
	return res.status(200).json({ message: "Se salvo con exito" });
}
