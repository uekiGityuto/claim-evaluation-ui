export class Reason {
    fraudScoreId: string;
    idx: number;
    factor: string;
    effect: number;

    constructor(fraudScoreId: string = '',
                idx: number = null,
                factor: string = '',
                effect: number = null) {
        this.fraudScoreId = fraudScoreId;
        this.idx = idx;
        this.factor = factor;
        this.effect = effect;
    }

    setRequestData(data: object) {
        this.fraudScoreId = data['fraudScoreId'.toString()];
        this.idx = data['idx'.toString()];
        this.factor = data['factor'.toString()];
        this.effect = data['effect'.toString()];
    }

}
