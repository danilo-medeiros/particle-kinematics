import CurveControl from "./curve-control";
import Chart from "./chart";
import { LineBasicMaterial } from "three";

const minDomainInput = document.getElementById("minDomain");
const maxDomainInput = document.getElementById("maxDomain");
const fxInput = document.getElementById("fx");
const fyInput = document.getElementById("fy");
const fzInput = document.getElementById("fz");
const mainForm = document.getElementById("mainForm");
const tSpan = document.getElementById("tSpan");
const tSlider = document.getElementById("tSlider");
const tControls = document.getElementById("tControls");

let chart1 = new Chart({
	targetDiv: document.getElementById("firstGraphDiv")
});

let curveControl;

window.addEventListener("resize", function (event) {
	chart1.resize();
})

mainForm.addEventListener("submit", function (event) {
	event.preventDefault();

	tControls.classList.remove("hidden");
	tSlider.setAttribute("max", maxDomainInput.value);
	tSlider.setAttribute("min", minDomainInput.value);
	tSlider.value = (parseFloat(minDomainInput.value) + parseFloat(maxDomainInput.value)) / 2;
	
	updateT();

	drawGraph();
});

tSlider.addEventListener("input", function() {
	updateT();
	drawVectors(parseFloat(tSlider.value));
});

const updateT = () => {
	tSpan.innerHTML = tSlider.value;
}

const drawGraph = () => {
	chart1.clear("function");

	let minDomain = parseInt(minDomainInput.value);
	let maxDomain = parseInt(maxDomainInput.value);

	curveControl = new CurveControl(
		[parseInt(minDomainInput.value), parseInt(maxDomainInput.value)],
		fxInput.value, fyInput.value, fzInput.value);

	for (let t = minDomain; t < maxDomain; t = t + 0.05) {

		let datasetTI = curveControl.getDataset(t);
		let datasetTF = curveControl.getDataset(t + 0.05);

		chart1.drawLine(chart1.defaultMaterial, datasetTI.r, datasetTF.r, "function");
	}

}

const drawVectors = (t) => {
	let datasetTI = curveControl.getDataset(t);
	drawVector(chart1, datasetTI.r, datasetTI.T, "T", 0xff0055);
	drawVector(chart1, datasetTI.r, datasetTI.N, "N", 0x0033cc);
	drawVector(chart1, datasetTI.r, datasetTI.B, "B", 0x009933);
	
}


const drawVector = (chart, i, f, name, color) => {
	chart.clear(name);
	chart.drawVector(color, i, f, name);
}
