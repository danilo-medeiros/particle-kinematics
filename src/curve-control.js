import Curve from "./curve";
import Mathjs from "mathjs";

export default class CurveControl {

    constructor(domain, fx, fy, fz) {
        this.domain = domain;
        this.continue = true;
        this.f = new Curve(fx, fy, fz);
    }

    evaluate(delay = 5, t = this.domain[0]) {
        let position = this.f.r(t);
        let speed = this.f.v(t);
        let acceleration = this.f.a(t);
        let speedModule = Math.sqrt(Math.pow(speed[0], 2) + Math.pow(speed[1], 2) + Math.pow(speed[2], 2));
        let unitTangent = speed.map(v => v / speedModule);
        let unitTangentModule = Math.sqrt(Math.pow(unitTangent[0], 2) + Math.pow(unitTangent[1], 2) + Math.pow(unitTangent[2], 2));
        let unitNormal = unitTangent.map(t => t / unitTangentModule);
        let unitBinormal = Mathjs.cross(unitTangent, unitNormal);
        
        if (this.continue && t < this.domain[1])
            setTimeout(() => {
                this.evaluate(delay, t+1);
            }, delay);
    }

}