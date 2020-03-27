export class Feedback {
    fraudScoreId: string;
    isCorrect: boolean;
    comment: string;

    constructor(fraudScoreId: string = '',
                isCorrect: boolean = null,
                comment: string = '') {
        this.fraudScoreId = fraudScoreId;
        this.isCorrect = isCorrect;
        this.comment = comment;
    }

    setRequestData(data: object) {
        this.fraudScoreId = data['fraudScoreId'.toString()];
        this.isCorrect = data['isCorrect'.toString()];
        this.comment = data['comment'.toString()];
    }

}
