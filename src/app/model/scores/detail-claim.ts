import { FraudScore } from './fraud-score';

export interface DetailClaim {
  claimNumber: string;
  insuredNameKanji: string;
  insuredNameKana: string;
  contractorNameKanji: string;
  contractorNameKana: string;
  insuranceKindExt: string;
  lossDate: Date;
  updateDate: Date;
  fraudScoreHistory: FraudScore[];
}
