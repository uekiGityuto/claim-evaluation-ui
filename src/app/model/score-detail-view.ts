import { ScoreDetail } from './score-detail';
import { CategoryClass } from './category-class';

export interface ScoreDetailView extends ScoreDetail {
  // ngClass用
  categoryClass: CategoryClass;
}
