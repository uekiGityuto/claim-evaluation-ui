import { ScoreDetail } from './score-detail';
import { ScoreCategory } from './score-category';

export interface FraudScore {
  scoringDate: Date;
  claimCategory: string;
  scoreDetail: ScoreDetail[];
  scoreCategories: ScoreCategory[]

}
