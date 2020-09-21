import { ClaimCategory } from './claim-category';
import { InsuranceKind } from './insurance-kind';

export interface SearchForm {
  // REQ_USER_ID: string;
  CLAIMNUMBER: string;
  CLAIMCATEGORYINFO: ClaimCategory[];
  INSURANCEKINDINFO: InsuranceKind[];
  FROMLOSSDATE: string;
  TOLOSSDATE: string;
  INSUREDNAMEKANA: string;
  INSUREDNAMEKANJI: string;
  CONTRACTORNAMEKANA: string;
  CONTRACTORNAMEKANJI: string;
  BUTENKANJI: string;
  KYOTENKANJI: string;
  LABELTYPE: string;
  ORDER: string;
  DISPLAYFROM: string;
}
