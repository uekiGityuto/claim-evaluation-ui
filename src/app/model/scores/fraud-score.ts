import { ScoreDetail } from './score-detail';
import { ScoreCategory } from './score-category';

export interface FraudScore {
  // TODO: serverからはstringで受け取る。serverのgsonで型変換するかui側で型変換するかは要検討
  scoringDate: Date;
  claimCategory: string;
  scoreDetail: ScoreDetail[];
  scoreCategories: ScoreCategory[]

}
