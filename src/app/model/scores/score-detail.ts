import { Reason } from './reason';

export class ScoreDetail {
  modelType: string;
  rank: string;
  // TODO: serverからはstringで受け取る。serverのgsonで型変換するかui側で型変換するかは要検討
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
