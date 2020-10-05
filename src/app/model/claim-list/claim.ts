export interface Claim {
  claimNumber: string;
  insuredNameKanji: string;
  insuredNameKana: string;
  contractorNameKanji: string;
  contractorNameKana: string;
  base: string;
  insuranceKind: string;
  lastUpdateDate: Date;
  lossDate: Date;
  claimCategory: string;
}
