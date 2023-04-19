/* eslint-disable import/no-anonymous-default-export */
import { loadLayersModel } from "@tensorflow/tfjs";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	message: string;
};

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "GET":
			return loadMode(req, res);

		default:
			return res.status(400).json({ message: "Error" });
	}
}

async function loadMode(req: NextApiRequest, res: NextApiResponse<Data>) {
	const model = await loadLayersModel("file://./model.json");
	console.log(model);
	return res.status(200).json({ message: "Hola" });
}
