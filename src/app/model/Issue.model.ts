export class Issue {
    staff: string;
    receipt_no: number;
    name: string;
    birthday: Date;
    kind: string;
    occurence_date:  Date;
    score: number;
    score_history: {date: string, value: number}[];
    factors: {factor: string, effect: number}[];
    estimation: boolean;
    estimation_memo: string;

    constructor(staff: string = "",
                receiptNo: number = null,
                name: string = "",
                birthday: string = "",
                kind: string = "",
                occurenceDate: string = "",
                score: number = 0,
                score_history: {date: string, value: number}[] = [],
                factors: {factor: string, effect: number}[] = [],
                estimation: boolean = false,
                estimation_memo: string = "") {
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

    setRequestData(data: Object) {
        this.staff = data['staff'];
        this.receipt_no = data['receipt_no'];
        this.name = data['name'];
        this.birthday = new Date(data['birthday']);
        this.kind = data['kind'];
        this.occurence_date = new Date(data['occurence_date']);
        this.score = data['score'];
        this.setScoreHistory(data['score_history']);
        this.setFactors(data['factors']);
        this.estimation = data['estimation'];
        this.estimation_memo = data['estimation_memo'];
    }

    setScoreHistory(score_history: Object[]): void {
        this.score_history = [];
        for (let score of score_history) {
            if(score) {
                try {
                    this.score_history.push({date: score['date'], value: score['value']});
                } catch(e) {}
            }
        }
    }

    setFactors(factors: Object[]): void {
        this.factors = [];
        for (let f of factors) {
            if(f) {
                try {
                    this.factors.push({factor: f['factor'], effect: f['effect']});
                } catch(e) {}
            }
        }
    }

}