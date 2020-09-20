import { ScoreDetail } from './score-detail';
import { ScoreCategory } from './score-category';

export interface FraudScore {
  SCORINGDATE: Date;
  CLAIMCATEGORY: string;
  SCOREDETAIL: ScoreDetail[];
  SCORECATEGORIES: ScoreCategory[];
}
