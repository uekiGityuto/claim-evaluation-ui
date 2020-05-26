export class Reason {
    factor: string;
    effect: number;

    constructor(factor: string = '',
                effect: number = null) {
        this.factor = factor;
        this.effect = effect;
    }

    setRequestData(data: object) {
        this.factor = data['factor'.toString()];
        this.effect = data['effect'.toString()];
    }

}
