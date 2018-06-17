import * as THREE from "three";
import * as THREE_ORBIT_CONTROLS from "three-orbit-controls";
const OrbitControls = THREE_ORBIT_CONTROLS(THREE);

export default class Chart {

    constructor(config) {
        this.config = {
            size: 15,
            scale: 1
        };
        this.init(config);
    }


    init(config) {
        this.config = Object.assign(this.config, config);
        this.camera = new THREE.PerspectiveCamera(45,
            this.config.targetDiv.offsetWidth / this.config.targetDiv.offsetHeight, 1, 500);
        this.camera.position.set(5, 2, 5);
        this.camera.zoom = 2;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xcdccfd);


        // CONTROLS SETTINGS
        this.controls = new OrbitControls(this.camera, this.config.targetDiv);
        this.controls.rotateSpeed = 2;


        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(this.config.targetDiv.offsetWidth, this.config.targetDiv.offsetHeight);

        this.config.targetDiv.appendChild(this.renderer.domElement);
        this.createR3();
    }

    createR3() {
        
        let material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 1 });
        
        let mainMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });

        for (let i = -1 * this.config.size; i <= this.config.size; i++) {
            let geometryX = new THREE.BufferGeometry();
            let geometryY = new THREE.BufferGeometry();
            let lineXVertices = new Float32Array([
                -1 * this.config.size * this.config.scale, 0.0, i * this.config.scale,
                this.config.size * this.config.scale, 0.0, i* this.config.scale
            ]);

            let lineYVertices = new Float32Array([
                i * this.config.scale, 0.0, -1 * this.config.size * this.config.scale,
                i* this.config.scale, 0.0, this.config.size * this.config.scale
            ]);
            geometryX.addAttribute( 'position', new THREE.BufferAttribute( lineXVertices, 3 ) );
            geometryY.addAttribute( 'position', new THREE.BufferAttribute( lineYVertices, 3 ) );
            let lineX = new THREE.Line( geometryX, i === 0 ? mainMaterial : material );
            let lineY = new THREE.Line( geometryY, i === 0 ? mainMaterial : material );
            this.scene.add(lineX);
            this.scene.add(lineY);
        }

        let geometryZ = new THREE.BufferGeometry();
        let lineZVertices = new Float32Array([
            0.0, 0.0, 0.0,
            0.0, this.config.scale * this.config.size, 0.0
        ]);
        geometryZ.addAttribute( 'position', new THREE.BufferAttribute( lineZVertices, 3 ) );
        let lineZ = new THREE.Line( geometryZ, mainMaterial );
        this.scene.add(lineZ);
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.camera.aspect = this.config.targetDiv.offsetWidth / this.config.targetDiv.offsetHeight;
        this.renderer.setSize(this.config.targetDiv.offsetWidth, this.config.targetDiv.offsetHeight);
        this.camera.updateProjectionMatrix();
        this.controls.update();
    }

}