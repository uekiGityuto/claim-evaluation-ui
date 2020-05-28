import { Timestamp } from 'rxjs';
import { Claim } from './Claim.model';
import { Reason } from './Reason.model';
import { Feedback } from './Feedback.model';
import { logging } from 'protractor';

export class Score {
    fraudScoreId: string;
    score: number;
    claimId: string;
    claim: Claim;
    reasons: Reason[];
    feedback: Feedback;
    history: Score[];
    isHighRisk: boolean;
    createDate: Date;
    updateDate: Date;

    constructor(fraudScoreId: string = '',
                score: number = null,
                claimId: string = '',
                claim: Claim = new Claim(),
                reasons: Reason[] = [],
                feedback: Feedback = new Feedback(),
                history: Score[] = [],
                createDate: Date = null,
                updateDate: Date = null) {
        this.fraudScoreId = fraudScoreId;
        this.score = score;
        this.claimId = claimId;
        this.claim = claim;
        this.reasons = reasons;
        this.feedback = feedback;
        this.history = history;
        this.createDate = new Date(createDate);
        this.updateDate = new Date(updateDate);
    }

    setRequestsData(data: object) {
        this.fraudScoreId = data['fraudScoreId'.toString()];
        this.score = data['score'.toString()];
        this.claimId = data['claimId'.toString()];
        this.claim = data['claim'.toString()];
        this.reasons = data['reasons'.toString()];
        this.feedback = data['feedback'.toString()];
        if (!this.feedback) {
          this.feedback = new Feedback();
        }
        this.feedback.claimId = this.claimId;
        if (this.feedback.fraudScoreId === null || this.feedback.fraudScoreId === undefined || this.feedback.fraudScoreId === '') {
          this.feedback.fraudScoreId = this.fraudScoreId;
        }
        this.history = data['history'.toString()];
        this.history.forEach(s => {
          s.isHighRisk = this.checkHighRisk(s.score);
        });
        this.isHighRisk = this.checkHighRisk(this.score);
        this.createDate = data['createDate'.toString()];
        this.updateDate = data['updateDate'.toString()];
    }

    checkHighRisk(score) {
      if (score >= 700) {
        return true;
      } else {
        return false;
      }

    }
}
