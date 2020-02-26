export class Issue {
    receipt_no: string;
    staff: string;
    name: string;
    birthday: Date;
    kind: string;
    occurence_date: Date;
    score: number;
    score_history: {date: string, value: number}[];
    factors: {factor: string, effect: number}[];
    estimation: boolean;
    estimation_memo: string;

    constructor(receiptNo: string = '',
                staff: string = '',
                name: string = '',
                birthday: string = '',
                kind: string = '',
                occurenceDate: string = '',
                score: number = 0,
                score_history: {date: string, value: number}[] = [],
                factors: {factor: string, effect: number}[] = [],
                estimation: boolean = false,
                estimation_memo: string = '') {
        this.staff = staff;
        this.receipt_no = receiptNo;
        this.name = name;
        this.birthday = new Date(birthday);
        this.kind = kind;
        this.occurence_date = new Date(occurenceDate);
        this.score = score;
        this.score_history = score_history;
        this.factors = factors;
        this.estimation = estimation;
        this.estimation_memo = estimation_memo;
    }

    setRequestData(data: object) {
        this.staff = data['staff'.toString()];
        this.receipt_no = data['receipt_no'.toString()];
        this.name = data['name'.toString()];
        this.birthday = new Date(data['birthday'.toString()]);
        this.kind = data['kind'.toString()];
        this.occurence_date = new Date(data['occurence_date'.toString()]);
        this.score = data['score'.toString()];
        this.setScoreHistory(data['score_history'.toString()]);
        this.setFactors(data['factors'.toString()]);
        this.estimation = data['estimation'.toString()];
        this.estimation_memo = data['estimation_memo'.toString()];
    }

    setScoreHistory(score_history: object[]): void {
        this.score_history = [];
        for (const score of score_history) {
            if (score) {
                try {
                    this.score_history.push({date: score['date'.toString()], value: score['value'.toString()]});
                } catch (e) {}
            }
        }
    }

    setFactors(factors: object[]): void {
        this.factors = [];
        for (const f of factors) {
            if (f) {
                try {
                    this.factors.push({factor: f['factor'.toString()], effect: f['effect'.toString()]});
                } catch (e) {}
            }
        }
    }

}
