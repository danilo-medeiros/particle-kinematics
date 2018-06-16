import Curve from "./curve";
import * as THREE from 'three';  
import CurveControl from "./curve-control";

const minDomainInput = document.getElementById("minDomain");
const maxDomainInput = document.getElementById("maxDomain");
const fxInput = document.getElementById("fx");
const fyInput = document.getElementById("fy");
const fzInput = document.getElementById("fz");
const mainForm = document.getElementById("mainForm");
let curveControl;

mainForm.addEventListener("submit", function(event) {
	event.preventDefault();
	curveControl = new CurveControl(
		[parseInt(minDomainInput.value), parseInt(maxDomainInput.value)], 
		fxInput.value, fyInput.value, fzInput.value);
	curveControl.evaluate();
});

/* 

var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 70, 800 / 300, 0.01, 10 );
	camera.position.z = 1;

	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	material = new THREE.MeshNormalMaterial();

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( 800, 300 );
	document.getElementById("main-div").appendChild( renderer.domElement );

}

function animate() {

	requestAnimationFrame( animate );

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

	renderer.render( scene, camera );

} */