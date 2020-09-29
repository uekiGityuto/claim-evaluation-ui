import { Reason } from './reason';

export class ScoreDetail {
  modelType: string;
  rank: string;
  score: number;
  reasons: Reason[];
  modelPresence: boolean;

  constructor(modelType = '') {
    this.modelType = modelType;
    this.rank = '判定不能';
    this.score = null;
    this.reasons = null;
    this.modelPresence = false;
  }

}
