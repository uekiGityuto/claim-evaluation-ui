import { Reason } from './reason';

export interface ScoreDetail {
  modelType: string;
  rank: string;
  score: string;
  reasons: Reason[];
}
