import Mathjs from "mathjs";

export default class Curve {

    constructor(fx, fy, fz) {

        this._r = [
            Mathjs.compile(fx),
            Mathjs.compile(fy),
            Mathjs.compile(fz)
        ];

        this._V = [
            Mathjs.derivative(fx, 't'),
            Mathjs.derivative(fy, 't'),
            Mathjs.derivative(fz, 't')
        ];

        let vModuleString = `sqrt((${Mathjs.string(this._V[0])})^2 + (${Mathjs.string(this._V[1])})^2 + (${Mathjs.string(this._V[2])})^2)`;
        let TString = this._V.map(V => `${V} / ${vModuleString}`);
        
        this._T = TString.map(T => Mathjs.compile(T));

        let TDerivativeString = TString.map(T => Mathjs.string(Mathjs.derivative(T, "t")));

        let TDerivativeModuleString = `sqrt((${TDerivativeString[0]})^2 + (${TDerivativeString[1]})^2 + (${TDerivativeString[2]})^2)`;
        this._N = TDerivativeString.map(T => Mathjs.compile(`${T} / ${TDerivativeModuleString}`));
        
    }

    T(t) {
        return this._T.map(T => T.eval({t: t}));
    }

    N(t) {
        return this._N.map(N => N.eval({t: t}));
    }

    getDataset(t) {
        let r = this._r.map(r => r.eval({t: t}));
        let T = this.T(t);
        let N = this.N(t);
        let B = Mathjs.cross(T, N);

        return {
            r: r,
            T: T,
            N: N,
            B: B
        }
    }

    getModule(vector) {
        return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
    }

}