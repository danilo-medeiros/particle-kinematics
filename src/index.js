import Curve from "./curve";
import CurveControl from "./curve-control";
import Chart from "./chart";

const minDomainInput = document.getElementById("minDomain");
const maxDomainInput = document.getElementById("maxDomain");
const fxInput = document.getElementById("fx");
const fyInput = document.getElementById("fy");
const fzInput = document.getElementById("fz");
const mainForm = document.getElementById("mainForm");

let chart1 = new Chart({
	targetDiv: document.getElementById("firstGraphDiv")
});

let curveControl;

window.addEventListener("resize", function (event) {
	chart1.resize();
})

mainForm.addEventListener("submit", function (event) {
	event.preventDefault();

	chart1.clear("function");

	let minDomain = parseInt(minDomainInput.value);
	let maxDomain = parseInt(maxDomainInput.value);

	curveControl = new CurveControl(
		[parseInt(minDomainInput.value), parseInt(maxDomainInput.value)],
		fxInput.value, fyInput.value, fzInput.value);

	drawPoint(minDomain, maxDomain);

	/* for (let t = minDomain; t < maxDomain; t = t + 0.05) {

		//chart1.drawLine(chart1.defaultMaterial, datasetTI.r, datasetTF.N);
	} */

});

const drawPoint = (t, maxDomain) => {
	let datasetTI = curveControl.getDataset(t);
	let datasetTF = curveControl.getDataset(t + 0.05);
	chart1.drawLine(chart1.defaultMaterial, datasetTI.r, datasetTF.r, "function");
	chart1.clear("a");
	chart1.drawLine(chart1.defaultMaterial, datasetTI.r, datasetTF.a, "a");
	if (t < maxDomain) {
		setTimeout(() => {
			drawPoint(t + 0.05, maxDomain);
		}, 5);
	}
}
