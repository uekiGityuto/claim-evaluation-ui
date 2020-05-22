export class Feedback {
    fraudScoreId: string;
    isCorrect: boolean;
    comment: string;
    createDate: Date;
    updateDate: Date;
    claimId: string;

    constructor(fraudScoreId: string = '',
                isCorrect: boolean = null,
                comment: string = '',
                createDate: Date = null,
                updateDate: Date = null,
                claimId: string = '') {
        this.fraudScoreId = fraudScoreId;
        this.isCorrect = isCorrect;
        this.comment = comment;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.claimId = claimId;
    }

    setRequestData(data: Object) {
        this.fraudScoreId = data['fraudScoreId'.toString()];
        this.isCorrect = data['isCorrect'.toString()];
        this.comment = data['comment'.toString()];
        this.createDate = data['createDate'.toString()];
        this.updateDate = data['updateDate'.toString()];
        this.claimId = data['claimId'.toString()];
    }

}
