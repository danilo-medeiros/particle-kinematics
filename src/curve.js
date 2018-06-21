import Mathjs from "mathjs";

export default class Curve {

    constructor(fx, fy, fz) {

        // Atributos que começam com '_' representam expressões do Mathjs a serem avaliadas

        // Vetor posição
        this._r = [
            Mathjs.compile(fx),
            Mathjs.compile(fy),
            Mathjs.compile(fz)
        ];

        // Vetor velocidade (derivada da posição)
        this._V = [
            Mathjs.derivative(fx, 't'),
            Mathjs.derivative(fy, 't'),
            Mathjs.derivative(fz, 't')
        ];

        // Módulo da velocidade
        let _vModuleString = this.norm(this._V);
        this._v = Mathjs.compile(_vModuleString);


        // Vetor unitário tangente (Velocidade normalizada)
        let _TString = this._V.map(V => `${V} / ${_vModuleString}`);

        // Vetor unitário normal (Derivada do vetor unitário tangente normalizada)
        let _TDerivativeString = _TString.map(T => Mathjs.string(Mathjs.derivative(T, "t")));
        let _TDerivativeModuleString = this.norm(_TDerivativeString);
        this._N = _TDerivativeString.map(T => Mathjs.compile(`${T} / ${_TDerivativeModuleString}`));

        // Vetor aceleração (derivada da velocidade)
        this._a = [
            Mathjs.derivative(Mathjs.string(this._V[0]), 't'),
            Mathjs.derivative(Mathjs.string(this._V[1]), 't'),
            Mathjs.derivative(Mathjs.string(this._V[2]), 't'),
        ]


        
        
        
    }

    r(t) {
        return this._r.map(r => r.eval({t: t}));
    }

    T(t) {
        let v = this._v.eval({t: t});
        return this._V.map(V => V.eval({t: t}) / v);
    }

    N(t) {
        return this._N.map(N => N.eval({t: t}));
    }

    getDataset(t) {

        let T = this.T(t);
        let N = this.N(t);

        let a = this._a.map(a => a.eval({t: t}));
        let v = this._v.eval({t: t});
        let aT = T.map(_T => _T * v);
        let aCpta = this._a.map((_a, i) => _a - aT[i]);


        /* 
        let r = this._r.map(r => r.eval({t: t}));
        let vEval = this._V.map(v => {
            if (!v.isConstantNode)
                return v.eval({t: t});
            return v.value;
        })
        let T = vEval.map(v => v / Mathjs.norm(vEval));
        let N = T.map(_T => _T / Mathjs.norm(_T));
        let B = Mathjs.cross(T, N);
        let a = this._a.map(a => a.eval({t: t}));
        let v = this._v.eval({t: t});
        let aT = T.map(_T => _T * v);
        let aCpta = this._a.map((_a, i) => _a - aT[i]);
 */

        return {
            r: this.r(t),
            T: T,
            N: N,
            B: Mathjs.cross(T, N)
        }
    }

    norm(vector) {
        return `sqrt((${Mathjs.string(vector[0])})^2 + (${Mathjs.string(vector[1])})^2 + (${Mathjs.string(vector[2])})^2)`;
    }

}