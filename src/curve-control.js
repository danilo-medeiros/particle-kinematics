import Curve from "./curve";
import Mathjs from "mathjs";

export default class CurveControl {

    constructor(domain, fx, fy, fz) {
        this.domain = domain;
        this.continue = true;
        this.f = new Curve(fx, fy, fz);
    }

    getPoint(t) {
        return this.f.r(t);
    }

    getDataset(t) {
        return this.f.getDataset(t);
    }

}