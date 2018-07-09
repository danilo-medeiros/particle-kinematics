import Chart from "./chart";
import Curve from "./curve";
import ChartCurvature from "./chart-curvature";

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
const functionSelect = document.getElementById("functionSelect");

const functions = {
	helice: [
		"cos(t)",
		"sin(t)",
		"t/2"
	],
	circunferencia: [
		"2cos(t)",
		"2sin(t)",
		"0"
	],
	elipse: [
		"2cos(t)",
		"sin(t)",
		"0"
	],
	reta: [
		"-t",
		"t",
		"t"
	]
}

let mode = "1";

let chart1 = new Chart({
	targetDiv: document.getElementById("firstGraphDiv")
});

let chart2 = new ChartCurvature(document.getElementById("curvatureCanvas"));

let curve;

animationControl.addEventListener("input", () => {
	animate(parseFloat(tInput.value));
})



functionSelect.addEventListener("input", () => {

	const selectedFunction = functionSelect.value;

	fxInput.value = functions[selectedFunction][0];
	fyInput.value = functions[selectedFunction][1];
	fzInput.value = functions[selectedFunction][2];

})

document.getElementById("mechanicsLink").addEventListener("click", () => {
	document.getElementById("descriptionMechanics").classList.remove("hidden");
	document.getElementById("descriptionCinematics").classList.add("hidden");
	document.getElementById("descriptionGeometrics").classList.add("hidden");
	mode = "1";
	clearVectors();
	drawVectors(parseFloat(tSlider.value));
	document.getElementById("mainDiv").scrollIntoView();

})

document.getElementById("cinematicsLink").addEventListener("click", () => {
	document.getElementById("descriptionCinematics").classList.remove("hidden");
	document.getElementById("descriptionMechanics").classList.add("hidden");
	document.getElementById("descriptionGeometrics").classList.add("hidden");
	mode = "2";
	clearVectors();
	drawVectors(parseFloat(tSlider.value));
	document.getElementById("mainDiv").scrollIntoView();
});

document.getElementById("geometryLink").addEventListener("click", () => {
	document.getElementById("descriptionGeometrics").classList.remove("hidden");
	document.getElementById("descriptionMechanics").classList.add("hidden");
	document.getElementById("descriptionCinematics").classList.add("hidden");
	mode = "3";
	clearVectors();
	drawVectors(parseFloat(tSlider.value));
	document.getElementById("mainDiv").scrollIntoView();
})

window.addEventListener("resize", function () {
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
	counter += 0.05;

	drawVectors(counter);
	tInput.value = counter;
	tSlider.value = counter;
	
	if (animationControl.checked === true) {
		if (counter >= parseFloat(maxDomainInput.value)) {
			counter = parseFloat(minDomainInput.value);
		}
		setTimeout(() => {
			animate(counter);
		}, 80);	
	}

	
}

const clearVectors = () => {
	chart1.clear("particle");
	chart1.clear("T");
	chart1.clear("N");
	chart1.clear("B");
	chart1.clear("a");
	chart1.clear("aT");
	chart1.clear("aCpta");
	chart1.clear("k");
	chart1.clear("circle");
	chart1.clear("tangent");
}

const drawGraph = () => {
	chart1.clear("function");
	clearVectors();

	const minDomain = parseFloat(minDomainInput.value);
	const maxDomain = parseFloat(maxDomainInput.value);

	curve = new Curve(fxInput.value, fyInput.value, fzInput.value);
	
	const epsilon = 0.05;

	const kDataset = {
		labels: [],
		values: []
	}

	const labels = [];
	const datasets = [{
		label: 'Curvatura',
		data: [],
		borderColor: "rgba(75, 192, 192, 1)",
		fill: false
	},
	{
		label: 'Torção',
		data: [],
		borderColor: "rgba(5, 223, 5, 1)",
		fill: false
	}];
	
	for (let t = minDomain; t <= maxDomain; t = Math.round((t + epsilon) * 100) / 100) {

		let initial = curve.getDataset(t);
		let final = curve.getDataset(t + epsilon);

		chart1.drawLine(chart1.defaultMaterial, initial.r, final.r, "function");
		labels.push(t.toString());
		datasets[0].data.push(Math.round(initial.k * 100) / 100);
		datasets[1].data.push(Math.round(initial.bent * 100) / 100);
	}
	
	chart2.draw(labels, datasets);
}

const drawVectors = (t) => {
	chart1.clear("particle");
	const dataset = curve.getDataset(t);
	let cameraPosition = [dataset.r[0] + 10, dataset.r[1] + 2, dataset.r[2] + 5];
	let cameraFocus = dataset.r;
	chart1.drawParticle(dataset.r);
	if (mode === "1") {
		drawVector(chart1, dataset.r, dataset.T, "T", 0xff0055);
		drawVector(chart1, dataset.r, dataset.N, "N", 0x0033cc);
		drawVector(chart1, dataset.r, dataset.B, "B", 0x009933);
	} else if (mode === "2") {
		drawVector(chart1, dataset.r, dataset.a, "a", 0x6c0081, dataset.aLength);
		drawVector(chart1, dataset.r, dataset.aT, "aT", 0xff00ff, dataset.aTLength);
		drawVector(chart1, dataset.r, dataset.aCpta, "aCpta", 0x008b80, dataset.aCptaLength);
	} else {
		chart1.clear("k");
		chart1.clear("circle");
		const radius = 1 / dataset.k;
		if (radius !== Infinity && !isNaN(radius)) {
			const center = [
				dataset.r[0] + dataset.N[0] * radius,
				dataset.r[1] + dataset.N[1] * radius,
				dataset.r[2] + dataset.N[2] * radius
			]
			if (!isNaN(radius)) {
				chart1.drawLine(chart1.defaultMaterial, dataset.r, center, "k");
				chart1.drawParticle(center);
				chart1.drawCircle(radius, center, dataset.T, dataset.N);	
			}
		}
	}
	if (moveCameraInput.checked === true)
		chart1.updateCamera(cameraPosition, cameraFocus);
	
}

const drawVector = (chart, i, f, name, color, length, lineWidth) => {
	chart.clear(name);
	chart.drawVector(color, i, f, name, length, lineWidth);
}

const initialize = () => {

	tControls.classList.remove("hidden");
	tSlider.setAttribute("max", maxDomainInput.value);
	tSlider.setAttribute("min", minDomainInput.value);
	tSlider.value = tInput.value = (parseFloat(minDomainInput.value) + parseFloat(maxDomainInput.value)) / 2;

	drawGraph();
	document.getElementById("mainDiv").scrollIntoView();
}

initialize();
