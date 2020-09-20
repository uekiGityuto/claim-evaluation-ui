import { Reason } from '../model/reason';

export interface ScoreDetail {
  MODELTYPE: string;
  RANK: string;
  SCORE: string;
  REASONS: Reason[];
}
