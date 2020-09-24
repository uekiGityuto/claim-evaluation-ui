import { ScoreDetail } from './scores/score-detail';
import { CategoryClass } from './category-class';

export interface ScoreDetailView extends ScoreDetail {
  // ngClass用
  categoryClass: CategoryClass;
}
