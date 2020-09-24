import { Claim } from './claim';

export interface ClaimList {
  claim: Claim[];
  order: string;
  fromPages: number;
  toPages: number;
  totalNumber: number;
}
