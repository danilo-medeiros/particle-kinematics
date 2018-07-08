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
        ];
        const Vf = [
            this._V[0].eval({t: (t + delta)}), 
            this._V[1].eval({t: (t + delta)}), 
            this._V[2].eval({t: (t + delta)})
        ];

        const v = Mathjs.norm(V);
        const vi = Mathjs.norm(Vi);
        const vf = Mathjs.norm(Vf);

        for (let i = 0; i < 3; i++) {
            r[i] = parseFloat(this._r[i].eval({t: t}));
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
        ];

        const B = Mathjs.cross(T, N);
        
        const a = [
            (Vf[0] - Vi[0]) / (delta * 2),
            (Vf[1] - Vi[1]) / (delta * 2),
            (Vf[2] - Vi[2]) / (delta * 2)
        ];

        const vDerivative = (vf - vi) / (delta * 2);

        const aT = [
            vDerivative * T[0],
            vDerivative * T[1],
            vDerivative * T[2]
        ]

        const k = Math.round((1 / v) * TDerivativeNorm * 100) / 100;

        // Torcao
        /* const Vii = [
            this._V[0].eval({t: t - delta * 2}), 
            this._V[1].eval({t: t - delta * 2}), 
            this._V[2].eval({t: t - delta * 2})
        ];
        const Vff = [
            this._V[0].eval({t: t + delta * 2}), 
            this._V[1].eval({t: t + delta * 2}), 
            this._V[2].eval({t: t + delta * 2})
        ];
        const vii = Mathjs.norm(Vii);
        const vff = Mathjs.norm(Vff);
        const Tii = [
            Vii[0] / vii,
            Vii[1] / vii,
            Vii[2] / vii
        ];
        const Tff = [
            Vff[0] / vff,
            Vff[1] / vff,
            Vff[2] / vff
        ];
        const TiDerivative = [
            (T[0] - Tii[0]) / (delta * 2),
            (T[1] - Tii[1]) / (delta * 2),
            (T[2] - Tii[2]) / (delta * 2)
        ];
        const TfDerivative = [
            (Tff[0] - T[0]) / (delta * 2),
            (Tff[1] - T[1]) / (delta * 2),
            (Tff[2] - T[2]) / (delta * 2)
        ];
        const TiDerivativeNorm = Mathjs.norm(TiDerivative);
        const TfDerivativeNorm = Mathjs.norm(TfDerivative);
        const Ni = [
            TiDerivative[0] / TiDerivativeNorm,
            TiDerivative[1] / TiDerivativeNorm,
            TiDerivative[2] / TiDerivativeNorm,
        ];
        const Nf = [
            TfDerivative[0] / TfDerivativeNorm,
            TfDerivative[1] / TfDerivativeNorm,
            TfDerivative[2] / TfDerivativeNorm,
        ];
        const Bi = Mathjs.cross(Ti, Ni);
        const Bf = Mathjs.cross(Tf, Nf);
        const BDerivative = [
            (Bf[0] - Bi[0]) / (delta * 2),
            (Bf[1] - Bi[1]) / (delta * 2),
            (Bf[2] - Bi[2]) / (delta * 2)
        ]

        const bent = (-1 / v) * Mathjs.dot(N, BDerivative);

        console.log(BDerivative); */

        const Vii = [
            this._V[0].eval({t: t - delta * 2}), 
            this._V[1].eval({t: t - delta * 2}), 
            this._V[2].eval({t: t - delta * 2})
        ];
        const Vff = [
            this._V[0].eval({t: t + delta * 2}), 
            this._V[1].eval({t: t + delta * 2}), 
            this._V[2].eval({t: t + delta * 2})
        ];

        const ai = [
            (V[0] - Vii[0]) / (delta * 2),
            (V[1] - Vii[1]) / (delta * 2),
            (V[2] - Vii[2]) / (delta * 2)
        ]

        const af = [
            (Vff[0] - V[0]) / (delta * 2),
            (Vff[1] - V[1]) / (delta * 2),
            (Vff[2] - V[2]) / (delta * 2)
        ]

        const aDerivative = [
            (af[0] - ai[0]) / (delta * 2),
            (af[1] - ai[1]) / (delta * 2),
            (af[2] - ai[2]) / (delta * 2)
        ]

        const bent = Mathjs.dot(Mathjs.cross(V, a), aDerivative) / Math.sqrt(Mathjs.norm(Mathjs.cross(V, a)));

        const aCpta = [
            a[0] - aT[0],
            a[1] - aT[1],
            a[2] - aT[2]
        ]

        const factor = Mathjs.norm(a);
   
        return {
            r: r,
            T: T,
            N: N,
            B: B,
            a: a,
            aLength: 1,
            aT: aT,
            aTLength: Mathjs.norm(aT) / factor,
            aCpta: aCpta,
            aCptaLength: Mathjs.norm(aCpta) / factor,
            k: k,
            bent: bent
        }
    }

}