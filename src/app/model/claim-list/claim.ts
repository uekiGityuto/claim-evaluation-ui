export interface Claim {
  claimNumber: string;
  insuredNameKanji: string;
  insuredNameKana: string;
  contractorNameKanji: string;
  contractorNameKana: string;
  butenKanji: string;
  kyotenKanji: string;
  insuranceKind: string;
  lastUpdateDate: Date;
  lossDate: Date;
  claimCategory: string;
}
