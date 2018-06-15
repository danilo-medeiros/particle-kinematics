import Mathjs from "mathjs";

export default class Curve {

    constructor(fx, fy, fz) {

        this._r = [
            Mathjs.compile(fx),
            Mathjs.compile(fy),
            Mathjs.compile(fz)
        ]

        this._v = [
            Mathjs.derivative(fx, 't'),
            Mathjs.derivative(fy, 't'),
            Mathjs.derivative(fz, 't')
        ]

        this._a = [
            Mathjs.derivative(this._v[0], 't'),
            Mathjs.derivative(this._v[1], 't'),
            Mathjs.derivative(this._v[2], 't')
        ];

    }

    r(t) {
        return this._r.map(r => r.eval({t: t}));
    }

    v(t) {
        return this._v.map(v => v.eval({t: t}));
    }

    a(t) {
        return this._a.map(a => a.eval({t: t}));
    }

}