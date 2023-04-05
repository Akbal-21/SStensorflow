//import * as tf from "@tensorflow/tfjs";
import { browser, GraphModel, loadGraphModel } from "@tensorflow/tfjs";
import { useRef } from "react";
import CanvasDraw from "react-canvas-draw";

const modelPath = "model.json";

export default function Home() {
	const canvasRef = useRef<CanvasDraw>(null);
	const modelRef = useRef<GraphModel>();

	const loadModel = async () => {
		modelRef.current = await loadGraphModel("model.json");
	};

	const handleSave = async () => {
		const canvas = canvasRef.current?.getSaveData();
		if (!canvas) {
			return;
		}
		const img = new Image();
		img.src = canvas.toString();
		console.log(img);

		const digit = await recognizeDigit(img);
		console.log("El dígito reconocido es:", digit);
	};

	const recognizeDigit = async (img: HTMLImageElement) => {
		const tensor = browser.fromPixels(img, 1).expandDims(0);
		const prediction = modelRef.current?.predict(tensor);
		//const digit = prediction?.argMax(1).dataSync()[0];
		return prediction;
	};

	return (
		<div>
			<CanvasDraw
				ref={canvasRef}
				brushRadius={2}
				canvasWidth={200}
				canvasHeight={200}
			/>
			<button onClick={handleSave}>Guardar</button>
		</div>
	);
}
