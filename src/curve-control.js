import Curve from "./curve";
import Mathjs from "mathjs";

export default class CurveControl {

    constructor(domain, fx, fy, fz) {
        this.domain = domain;
        this.continue = true;
        this.f = new Curve(fx, fy, fz);
    }


    getDataset(t) {
        return this.f.getDataset(t);
    }

    getEpsilon(t) {
        let mt1 = this.f.getModule(this.f.getDataset(t).r);
        let mt2 = this.f.getModule(this.f.getDataset(t + 1).r);
        return mt2 !== mt1 ? Math.abs(0.1 / (mt2 - mt1)) : 0.1;
    }

}