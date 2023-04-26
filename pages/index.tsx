// import * as tf from "@tensorflow/tfjs";

import { LayersModel, browser, image, loadLayersModel } from "@tensorflow/tfjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

//! si se quiere cambiar por el nuestro se tiene que invertir el comentario del modelUrl
const modelUrl = "https://akbal-21.github.io/api_model/number/model.json";

// const modelUrl =
// "https://akbal-21.github.io/api_model/number_owner/model.json";

export default function Home() {
	//! si se quiere cambiar por el nuestro se tiene que invertir el comentario del useState de model
	const [model, setModel] = useState<LayersModel>();
	// const [model, setModel] = useState<GraphModel>();
	const [imageUrl, setImageUrl] = useState("");
	const canvasRef = useRef<SignatureCanvas>(null);

	// Se cargfa el modelo
	useEffect(() => {
		const loadmodel = async () => {
			//! si se quiere cambiar por el nuestro se tiene que invertir el comentario del modelCharge
			// const modelCharge = await loadGraphModel(modelUrl);
			const modelCharge = await loadLayersModel(modelUrl);
			setModel(modelCharge);
		};
		loadmodel();
	}, []);

	// Funcion para predecir digitos
	const predict = async () => {
		if (canvasRef.current) {
			const canvas = canvasRef.current?.getCanvas() as HTMLCanvasElement;

			const img = browser.fromPixels(canvas, 1);
			const imgResized = image.resizeBilinear(img, [28, 28]);
			const tensor = imgResized.toFloat().div(255).reshape([-1, 28, 28, 1]);
			const tensorNeg = tensor.mul(-1).add(1);
			// const arr = await tensorNeg.array();

			const predict = model?.predict(tensorNeg);
			if (!predict) {
				console.log("No hay parametros");
				return;
			}
			// const predicts = Array.from(predict.toString());
			console.log("predict");
			const predictionsArray = await predict.array(); // Convertir tensor a array

			// Encontrar la clase con la probabilidad más alta
			let maxProb = -1;
			let maxIndex = -1;
			for (let i = 0; i < predictionsArray[0].length; i++) {
				console.log(`Clase ${i}: ${predictionsArray[0][i] * 100}%`);
				if (predictionsArray[0][i] > maxProb) {
					maxProb = predictionsArray[0][i];
					maxIndex = i;
				}
			}
			console.log("Clase identificada:", maxIndex);
		}
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
					backgroundColor=" #d6dbdf "
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
