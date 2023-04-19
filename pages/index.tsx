import * as tf from "@tensorflow/tfjs";

import { browser, image } from "@tensorflow/tfjs";
import Image from "next/image";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

// const modelUrl = "file://./model.json";

const modelUrl =
	"https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json";

export default function Home() {
	const [imageUrl, setImageUrl] = useState("");
	const canvasRef = useRef<SignatureCanvas>(null);

	// Se cargfa el modelo
	const loadModel = async () => {
		// 	console.log("Loading model");
		// 	const model = loadGraphModel("file://./model.json", { fromTFHub: true });
		// 	if (!model) {
		// 		return "Error al cargar el modelo";
		// 	}
		// 	console.log("Model loaded");
		// 	console.log(model);
		// 	return model;

		const model = await tf.loadGraphModel(modelUrl);
		const zeros = tf.zeros([1, 224, 224, 3]);
		model.predict(zeros);
		console.log(`Hola ${model.predict(zeros)}`);
	};

	//se asigna a la variable "model" el modelo
	const model = loadModel();
	// console.log(model);

	// Funcion para predecir digitos
	const predict = async () => {
		if (canvasRef.current) {
			const canvas = canvasRef.current?.getCanvas() as HTMLCanvasElement;
			const input = browser.fromPixels(canvas);
			const resized = image.resizeBilinear(input, [28, 28]);
			const tensor = resized.expandDims(0).toFloat().div(255);
			// const predict = model.predict(tensor);
			// if (!predict) {
			// console.log("No hay parametros");
			// return;
			// }
			// const predicts = Array.from(predict.toString());
			// console.log(predicts);
			//const predictedDigit = prediction.indexOf(Math.max(...prediction));
			// setPrediction(predicts.indexOf(Math.max(...predicts)));
			// console.log(prediction);
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
					canvasProps={{ width: 200, height: 200 }}
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
