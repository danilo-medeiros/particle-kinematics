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

        // CAMERA SETTINGS
        this.camera = new THREE.PerspectiveCamera(45,
            this.config.targetDiv.offsetWidth / this.config.targetDiv.offsetHeight, 1, 500);
        this.camera.position.set(5, 5, 2);
        this.camera.zoom = 2;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.up = new THREE.Vector3(0, 0, 1);

        // SCENE SETTINGS
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xcdccfd);


        // CONTROLS SETTINGS
        this.controls = new OrbitControls(this.camera, this.config.targetDiv);
        this.controls.rotateSpeed = 2;
        this.controls.enableKeys = false;

        // RENDERER SETTINGS
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.config.targetDiv.offsetWidth, this.config.targetDiv.offsetHeight);

        this.defaultMaterial = new THREE.LineBasicMaterial({ color: 0x000, linewidth: 2 });

        this.config.targetDiv.appendChild(this.renderer.domElement);
        this.createR3();
        this.animate();
    }

    drawLine(material, initial, final, name) {
        let geometry = new THREE.BufferGeometry();
        let vertices = new Float32Array(initial.concat(final));
        geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3));
        let line = new THREE.Line(geometry, material);
        line.name = name;
        this.scene.add(line);
    }

    drawParticle(position) {
        this.clear("particle");
        let geometry = new THREE.SphereBufferGeometry(0.05, 32, 32);
        let sphere = new THREE.Mesh(geometry, this.defaultMaterial);
        sphere.name = "particle";
        sphere.position.set(position[0], position[1], position[2]);
        this.scene.add(sphere);
    }

    drawVector(color, initial, final, name) {
        if (final.includes(NaN))
            return;

        let dir = new THREE.Vector3(final[0], final[1], final[2]);
        dir.normalize();
        let origin = new THREE.Vector3(initial[0], initial[1], initial[2]);
        let arrow = new THREE.ArrowHelper(dir, origin, 1, color);
        arrow.line.material.linewidth = 2;
        arrow.name = name;
        this.scene.add(arrow);
    }

    clear(name) {
        let selectedObject = this.scene.getObjectByName(name);
        while (selectedObject !== undefined) {
            this.scene.remove(selectedObject);
            selectedObject = this.scene.getObjectByName(name);
        }
    }

    createR3() {

        let material = new THREE.LineBasicMaterial({ color: 0x666666, linewidth: 1 });
        let xMaterial = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 3});
        let yMaterial = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 3});
        let zMaterial = new THREE.LineBasicMaterial({color: 0x002db3, linewidth: 3});

        for (let i = -1 * this.config.size; i <= this.config.size; i++) {

            this.drawLine(material,
                [-1 * this.config.size * this.config.scale, i * this.config.scale, 0.0],
                [this.config.size * this.config.scale, i * this.config.scale, 0.0]
            );

            this.drawLine(material,
                [i * this.config.scale, -1 * this.config.size * this.config.scale, 0.0],
                [i * this.config.scale, this.config.size * this.config.scale, 0.0]
            );

            if (i === 0) {
                this.drawLine(xMaterial, [0, 0, 0], [this.config.size * this.config.scale, 0.0, i * this.config.scale]);
                this.drawLine(zMaterial, [0, 0, 0], [i * this.config.scale, 0.0, this.config.size * this.config.scale]);
            }
        }

        this.drawLine(yMaterial, [0.0, 0.0, 0.0], [0.0, this.config.scale * this.config.size, 0.0]);
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

    updateCamera(newLocation, newFocus) {
        this.camera.position.set(newLocation[0], newLocation[1], newLocation[2]);
        this.controls.target = new THREE.Vector3(newFocus[0], newFocus[1], newFocus[2]);
        this.camera.updateProjectionMatrix();
        this.controls.update();
    }

}