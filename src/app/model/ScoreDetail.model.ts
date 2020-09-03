import { Reason } from './Reason.model';

export class ScoreDetail {
  modelType: string;
  rank: string;
  score: number;
  reasons: Reason[];

  constructor(modelType: string = '',
    rank: string = '',
    score: number = 0,
    reasons: Reason[] = []) {
    this.modelType = modelType;
    this.rank = rank;
    this.score = score;
    this.reasons = reasons;
  }

  setRequestData(data: object): void {
    this.modelType = data['MODELTYPE'.toString()];
    this.rank = data['RANK'.toString()];
    this.score = data['SCORE'.toString()];
    this.reasons = data['REASONS'.toString()];
    this.reasons.forEach(reason => {
      reason.setRequestData(reason);
    });

  }

}
