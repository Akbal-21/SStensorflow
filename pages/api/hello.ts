// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/database";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	message: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	switch (req.method) {
		case "GET":
			return starDB(req, res);

		default:
			return res.status(400).json({ message: "Bad Request" });
	}
}
async function starDB(req: NextApiRequest, res: NextApiResponse<Data>) {
	try {
		await db.connect();

		await db.desconect();
		return res.status(200).json({ message: "DB Created" });
	} catch (error) {
		console.log(error);
	}
}
