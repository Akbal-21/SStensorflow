// import * as tf from "@tensorflow/tfjs";

import { browser, image, loadGraphModel } from "@tensorflow/tfjs";
import Image from "next/image";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

// const modelUrl = "file://./model.json";

const modelUrl = "https://akbal-21.github.io/api_model/model.json";

export default function Home() {
	const [imageUrl, setImageUrl] = useState("");
	const canvasRef = useRef<SignatureCanvas>(null);

	// Se cargfa el modelo

	// Funcion para predecir digitos
	const predict = async () => {
		if (canvasRef.current) {
			const model = await loadGraphModel(modelUrl);
			const canvas = canvasRef.current?.getCanvas() as HTMLCanvasElement;
			// const input = browser.fromPixels(canvas, 1);
			// const resized = image.resizeBilinear(input, [28, 28]);
			// const tensor = resized.expandDims(0).toFloat().div(255);
			// console.log(tensor);
			const img = browser.fromPixels(canvas, 1);
			const imgResized = image.resizeBilinear(img, [28, 28]);
			// const imgCast = cast(imgResized, "float32");
			const tensor = imgResized.expandDims(0).toFloat().div(255);

			const predict = model.predict(tensor);
			if (!predict) {
				console.log("No hay parametros");
				return;
			}
			// const predicts = Array.from(predict.toString());
			console.log(predict);
			// const predictedDigit = predicts.indexOf(Math.max(...prediction));
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
