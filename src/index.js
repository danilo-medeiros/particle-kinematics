import Chart from "./chart";
import Curve from "./curve";

const minDomainInput = document.getElementById("minDomain");
const maxDomainInput = document.getElementById("maxDomain");
const fxInput = document.getElementById("fx");
const fyInput = document.getElementById("fy");
const fzInput = document.getElementById("fz");
const tInput = document.getElementById("tValue");
const tSlider = document.getElementById("tSlider");
const tControls = document.getElementById("tControls");
const moveCameraInput = document.getElementById("moveCamera");
const animationControl = document.getElementById("animate");
let mode = "1";

let chart1 = new Chart({
	targetDiv: document.getElementById("firstGraphDiv")
});

let curve;

animationControl.addEventListener("input", () => {
	animate(parseFloat(tInput.value));
})

document.getElementById("mechanicsLink").addEventListener("click", () => {
	document.getElementById("descriptionMechanics").classList.remove("hidden");
	document.getElementById("descriptionCinematics").classList.add("hidden");
	mode = "1";
	clearVectors();
})

document.getElementById("cinematicsLink").addEventListener("click", () => {
	document.getElementById("descriptionCinematics").classList.remove("hidden");
	document.getElementById("descriptionMechanics").classList.add("hidden");
	mode = "2";
	clearVectors();
});

document.getElementById("geometryLink").addEventListener("click", () => {
	mode = "3";
})

window.addEventListener("resize", function (event) {
	chart1.resize();
})

document.getElementById("mainForm").addEventListener("submit", function (event) {
	event.preventDefault();
	initialize();
});

tSlider.addEventListener("input", function () {
	tInput.value = tSlider.value;
	drawVectors(parseFloat(tSlider.value));
});

tInput.addEventListener("input", function () {
	tSlider.value = parseFloat(tInput.value);
	drawVectors(parseFloat(tInput.value));
});

const animate = (counter) => {
	counter += 0.01;
	drawVectors(counter);
	tInput.value = counter;
	tSlider.value = counter;
	
	if (animationControl.checked === true) {
		if (counter >= parseFloat(maxDomainInput.value)) {
			counter = parseFloat(minDomainInput.value);
		}
		setTimeout(() => {
			animate(counter);
		}, 1);	
	}

	
}

const clearVectors = () => {
	chart1.clear("particle");
	chart1.clear("T");
	chart1.clear("N");
	chart1.clear("B");
	chart1.clear("a");
	chart1.clear("aT");
	chart1.clear("aTt");
	chart1.clear("aCpta");
}

const drawGraph = () => {
	chart1.clear("function");
	clearVectors();

	let minDomain = parseFloat(minDomainInput.value);
	let maxDomain = parseFloat(maxDomainInput.value);

	curve = new Curve(fxInput.value, fyInput.value, fzInput.value);
	
	let epsilon = 0.05;
	
	for (let t = minDomain; t < maxDomain; t = t + epsilon) {
		let pointTI = curve.r(t);
		let pointTF = curve.r(t + epsilon);
		chart1.drawLine(chart1.defaultMaterial, pointTI, pointTF, "function");
	}
}

const drawVectors = (t) => {
	const dataset = curve.getDataset(t);
	if (mode === "1") {
		chart1.drawParticle(dataset.r);
		drawVector(chart1, dataset.r, dataset.T, "T", 0xff0055);
		drawVector(chart1, dataset.r, dataset.N, "N", 0x0033cc);
		drawVector(chart1, dataset.r, dataset.B, "B", 0x009933);
		if (moveCameraInput.checked === true)
			chart1.updateCamera([dataset.r[0] + 10, dataset.r[1] + 2, dataset.r[2] + 5], dataset.r);
	} else if (mode === "2") {
		chart1.drawParticle(dataset.r);
		drawVector(chart1, dataset.r, dataset.a, "a", 0x6c0081, dataset.aLength);
		drawVector(chart1, dataset.r, dataset.aT, "aT", 0xff00ff, dataset.aTLength);
		drawVector(chart1, dataset.r, dataset.aCpta, "aCpta", 0x008b80, dataset.aCptaLength);
		if (moveCameraInput.checked === true)
			chart1.updateCamera([dataset.r[0] + 10, dataset.r[1] + 2, dataset.r[2] + 5], dataset.r);
	}
	
}


const drawVector = (chart, i, f, name, color, length) => {
	chart.clear(name);
	chart.drawVector(color, i, f, name, length);
}

const initialize = () => {
	/* submitButton.innerHTML = "Carregando...";
	submitButton.setAttribute("disabled", "true"); */

	tControls.classList.remove("hidden");
	tSlider.setAttribute("max", maxDomainInput.value);
	tSlider.setAttribute("min", minDomainInput.value);
	tSlider.value = tInput.value = (parseFloat(minDomainInput.value) + parseFloat(maxDomainInput.value)) / 2;

	drawGraph();

	/* drawGraph().then(() => {
		submitButton.innerHTML = "Gerar gráfico";
		submitButton.removeAttribute("disabled");
	}); */
}

initialize();
