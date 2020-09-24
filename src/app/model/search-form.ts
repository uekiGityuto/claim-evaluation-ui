import { ClaimCategory } from './claim-category';
import { InsuranceKind } from './insurance-kind';

export interface SearchForm {
  // REQ_USER_ID: string;
  claimNumber: string;
  claimCategoryInfo: ClaimCategory[];
  insuranceKindInfo: InsuranceKind[];
  fromLossDate: string;
  toLossDate: string;
  insuredNameKana: string;
  insuredNameKanji: string;
  contractorNameKana: string;
  contractorNameKanji: string;
  butenKanji: string;
  kyotenKanji: string;
  labelType: string;
  order: string;
  displayFrom: string;
}
