import { Claim } from './claim-list/claim';
import { CategoryClass } from './category-class';

export interface ClaimView extends Claim {
  // ngClass用
  categoryClass: CategoryClass;
}
