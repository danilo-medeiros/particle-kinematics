import Curve from "./curve";
import Mathjs from "mathjs";

export default class CurveControl {

    constructor(fx, fy, fz) {
        this.f = new Curve(fx, fy, fz);
    }

    getPoint(t) {
        return this.f.r(t);
    }

    getDataset(t) {
        return this.f.getDataset(t);
    }
}