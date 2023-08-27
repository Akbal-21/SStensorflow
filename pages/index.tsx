// import * as tf from "@tensorflow/tfjs";

import {
	LayersModel,
	Rank,
	Tensor,
	browser,
	image,
	loadLayersModel,
} from "@tensorflow/tfjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import ssApi from "../api/index";

const modelUrl =
	"https://raw.githubusercontent.com/francisco-renteria/francisco-renteria.github.io/main/digitos/model.json";

const modelUrl2 =
	"https://raw.githubusercontent.com/francisco-renteria/francisco-renteria.github.io/main/letras/model.json";
const modelUrls = [modelUrl, modelUrl2];
// rome-ignore lint/style/useConst: <explanation>
let predict3 = "";

export default function Home() {
	const [model, setModel] = useState<LayersModel>();
	const [imageUrl, setImageUrl] = useState("");
	const canvasRef = useRef<SignatureCanvas>(null);

	// Se cargfa el modelo
	useEffect(() => {
		const loadmodel = async () => {
			//letras 1
			//digitos 0
			const boo = 1;

			const modelCharge = await loadLayersModel(modelUrls[boo]);
			setModel(modelCharge);
			setModel(modelCharge);
		};
		loadmodel();
	}, []);

	// Funcion para predecir digitos
	const predict = async () => {
		if (canvasRef.current) {
			// const srcImg = canvasRef.current?.getTrimmedCanvas().toDataURL();
			// setImageUrl(srcImg || "");
			const canvas = canvasRef.current?.getCanvas() as HTMLCanvasElement;

			const img = browser.fromPixels(canvas, 1);
			const imgResized = image.resizeBilinear(img, [28, 28]);
			const tensor = imgResized.expandDims(0).toFloat().div(255);
			const tensorNeg = tensor.mul(-1).add(1);

			const predict: Tensor<Rank> | Tensor<Rank>[] | undefined =
				model?.predict(tensorNeg);

			if (!predict || !(predict instanceof Tensor)) {
				console.log("No hay parametros");
				return;
			}

			const predictionsArray = predict.arraySync(); // Convertir tensor a array
			console.log(typeof predict);

			console.log(predictionsArray);

			prediccion(predictionsArray);

			// setPrediction(predict3);
		}
	};

	const saveData = async (
		// srcImg: string,
		predict3: string,
	) => {
		// console.log({ srcImg, predict3 });

		await ssApi({
			method: "POST",
			url: "/insertPredict",
			data: { predict3 },
		});
	};

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const prediccion = (predictionsArray: any) => {
		// Encontrar la clase con la probabilidad más alta
		let maxProb = -1;
		let maxIndex = -1;
		for (let i = 0; i < predictionsArray[0].length; i++) {
			if (predictionsArray[0][i] > maxProb) {
				maxProb = predictionsArray[0][i];
				maxIndex = i;
			}
		}
		if (predictionsArray[0].length === 10) predict3 = String(maxIndex);

		if (predictionsArray[0].length === 52)
			if (maxIndex <= 25) predict3 = String.fromCharCode(maxIndex + 65);
			else predict3 = String.fromCharCode(maxIndex + 71);

		console.log(predict3);
	};

	const handleSave = () => {
		const dataUrl = canvasRef.current?.getTrimmedCanvas().toDataURL();
		setImageUrl(dataUrl || "");
	};

	const handleclear = () => {
		canvasRef.current?.clear();
	};
	return (
		<>
			<div>
				<SignatureCanvas
					ref={canvasRef}
					backgroundColor=" white"
					dotSize={8}
					minWidth={8}
					maxWidth={8}
					canvasProps={{
						width: 200,
						height: 200,
						style: { border: "2px solid #000" },
						title: "Dibuja",
					}}
				/>
			</div>
			<div style={{ margin: "5px" }}>
				{/* rome-ignore lint/a11y/useButtonType: <explanation> */}
				<button onClick={handleSave}>Guardar</button>
				{/* rome-ignore lint/a11y/useButtonType: <explanation> */}
				<button onClick={predict}>Predecir</button>
				{/* rome-ignore lint/a11y/useButtonType: <explanation> */}
				<button onClick={handleclear}>Limpiar</button>
			</div>

			<div>
				{imageUrl && (
					<Image src={imageUrl} alt="signature" width={50} height={50} />
				)}
			</div>
		</>
	);
}
