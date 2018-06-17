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

chart1.animate();

let curveControl;

window.addEventListener("resize", function(event) {
	chart1.resize();
})

mainForm.addEventListener("submit", function(event) {
	event.preventDefault();
	curveControl = new CurveControl(
		[parseInt(minDomainInput.value), parseInt(maxDomainInput.value)], 
		fxInput.value, fyInput.value, fzInput.value);
	curveControl.evaluate();
});
