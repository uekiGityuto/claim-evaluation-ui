import { Timestamp } from 'rxjs';
import { Claim } from './Claim.model';
import { Reason } from './Reason.model';
import { Feedback } from './Feedback.model';
import { logging } from 'protractor';

export class Score {
    fraudScoreId: string;
    score: number;
    createDate: Date;
    claimId: string;
    claim: Claim;
    reasons: Reason[];
    feedback: Feedback;

    constructor(fraudScoreId: string = '',
                score: number = null,
                createDate: string = '',
                claimId: string = '',
                claim: Claim = new Claim(),
                reasons: Reason[] = [],
                feedback: Feedback = new Feedback()) {
        this.fraudScoreId = fraudScoreId;
        this.score = score;
        this.claimId = claimId;
        this.createDate = new Date(createDate);
        this.claim = claim;
        this.reasons = reasons;
        this.feedback = feedback;
    }

    setRequestsData(data: Object) {
        this.fraudScoreId = data['fraudScoreId'.toString()];
        this.score = data['score'.toString()];
        this.claimId = data['claimId'.toString()];
        this.createDate = data['createDate'.toString()];
        this.claim = data['claim'.toString()];
        this.reasons = data['reasons'.toString()];
        this.feedback = data['feedback'.toString()];
        if (this.feedback.fraudScoreId == undefined || this.feedback.fraudScoreId == '') {
            this.feedback.fraudScoreId = this.fraudScoreId;
        }


        let ludate: Number;
        ludate = data['claim'.toString()].commentList[5].updateDate;
        
    }
}