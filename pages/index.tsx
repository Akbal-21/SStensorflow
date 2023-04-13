//import * as tf from "@tensorflow/tfjs";
import {
	browser,
	GraphModel,
	image,
	LayersModel,
	loadLayersModel,
} from "@tensorflow/tfjs";
import Image from "next/image";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const modelPath = "model.json";

export default function Home() {
	//Se creaan los estados del modelo de prediccion
	const [model, setModel] = useState<LayersModel>();
	const [prediction, setPrediction] = useState<number | undefined>();
	const canvasRef = useRef<SignatureCanvas>(null);

	const modelRef = useRef<GraphModel>();
	//
	const loadModel = async () => {
		const modelref = await loadLayersModel("model.json");
		setModel(modelref);
	};
	loadModel();
	//Se crea la referencia del canvas

	//Se toma el contenido del canvas y se envia al modelo para la prediccion
	const predict = async () => {
		if (canvasRef.current) {
			// ! ?.getCanvas() as HTMLCanvasElement

			const canvas = canvasRef.current?.getCanvas() as HTMLCanvasElement;

			const input = browser.fromPixels(canvas);

			const resized = image.resizeBilinear(input, [28, 28]);
			const tensor = resized.expandDims(0).toFloat().div(255);

			const predict = model?.predict(tensor);
			if (!predict) {
				console.log("No hay parametros");
				return;
			}
			const predicts = Array.from(predict.toString());
			console.log(predicts);
			//const predictedDigit = prediction.indexOf(Math.max(...prediction));
			// setPrediction(predicts.indexOf(Math.max(...predicts)));
			// console.log(prediction);
		}
	};

	const [imageUrl, setImageUrl] = useState("");

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
