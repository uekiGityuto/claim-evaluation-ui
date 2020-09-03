import { Reason } from './Reason.model';
import { ScoreDetail } from './ScoreDetail.model';

export class FraudScore {
  scoringDate: Date;
  claimCategory: string;
  scoreDetails: ScoreDetail[];

  constructor(scoringDate: Date = null,
    claimCategory: string = '',
    scoreDetails: ScoreDetail[] = []) {
    this.scoringDate = scoringDate;
    this.claimCategory = claimCategory;
    this.scoreDetails = scoreDetails;
  }

  setRequestData(data: object): void {
    this.scoringDate = data['SCORINGDATE'.toString()];
    this.claimCategory = data['CLAIMCATEGORY'.toString()];
    this.scoreDetails = data['SCOREDETAIL'.toString()];
    this.scoreDetails.forEach(scoreDetail => {
      scoreDetail.setRequestData(scoreDetail);
    });
  }

}
