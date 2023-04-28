// import * as tf from "@tensorflow/tfjs";

import { LayersModel, browser, image, loadLayersModel } from "@tensorflow/tfjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import ssApi from "../api/index";

const modelUrl =
	"https://raw.githubusercontent.com/francisco-renteria/francisco-renteria.github.io/main/digitos/model.json";

// rome-ignore lint/style/useConst: <explanation>
let predict3: string = "";

export default function Home() {
	const [model, setModel] = useState<LayersModel>();
	const [prediction, setPrediction] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const canvasRef = useRef<SignatureCanvas>(null);

	// Se cargfa el modelo
	useEffect(() => {
		const loadmodel = async () => {
			const modelCharge = await loadLayersModel(modelUrl);
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

			const predict = model?.predict(tensorNeg);
			if (!predict) {
				console.log("No hay parametros");
				return;
			}

			const predictionsArray = await predict.arraySync(); // Convertir tensor a array

			prediccion(predictionsArray);

			saveData(
				// srcImg,
				predict3,
			);
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
				<button onClick={handleSave}>Guardar</button>
				<button onClick={predict}>Predecir</button>
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
