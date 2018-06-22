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

    }

    r(t) {
        return [
            this._r[0].eval({t: t}),
            this._r[1].eval({t: t}),
            this._r[2].eval({t: t})
        ]
    }

    getDataset(t) {

        const delta = 0.0001;
        const r = [];
        const T = [];
        const Ti = [];
        const Tf = [];

        const V = [
            this._V[0].eval({t: t}), 
            this._V[1].eval({t: t}), 
            this._V[2].eval({t: t})
        ];
        const Vi = [
            this._V[0].eval({t: (t - delta)}), 
            this._V[1].eval({t: (t - delta)}), 
            this._V[2].eval({t: (t - delta)})
        ]
        const Vf = [
            this._V[0].eval({t: (t + delta)}), 
            this._V[1].eval({t: (t + delta)}), 
            this._V[2].eval({t: (t + delta)})
        ]

        const v = Mathjs.norm(V);
        const vi = Mathjs.norm(Vi);
        const vf = Mathjs.norm(Vf);

        for (let i = 0; i < 3; i++) {
            r[i] = this._r[i].eval({t: t});
            T[i] = V[i] / v;
            Ti[i] = Vi[i] / vi;
            Tf[i] = Vf[i] / vf;
        }
        
        const TDerivative = [
            (Tf[0] - Ti[0]) / (delta * 2),
            (Tf[1] - Ti[1]) / (delta * 2),
            (Tf[2] - Ti[2]) / (delta * 2)
        ];
        const TDerivativeNorm = Mathjs.norm(TDerivative);
        const N = [
            TDerivative[0] / TDerivativeNorm,
            TDerivative[1] / TDerivativeNorm,
            TDerivative[2] / TDerivativeNorm,
        ]

        const B = Mathjs.cross(T, N);

        const aTt = [
            N[0] + T[0],
            N[1] + T[1],
            N[2] + T[2]
        ]

        const a = [
            (Vf[0] - Vi[0]) / (delta * 2),
            (Vf[1] - Vi[1]) / (delta * 2),
            (Vf[2] - Vi[2]) / (delta * 2)
        ]

        
        const k = [
            T[0] * (TDerivativeNorm / v),
            T[1] * (TDerivativeNorm / v),
            T[2] * (TDerivativeNorm / v),
        ];

        return {
            r: r,
            T: T,
            N: N,
            B: B,
            aTt: aTt,
            k: k
        }
    }

}