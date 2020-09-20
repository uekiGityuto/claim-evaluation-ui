import { Injectable } from '@angular/core';
import { CategoryClass } from '../model/category-class';

/**
 * ngClassに値セットするservice
 * @author SKK231527 李
 */
@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor() { }

  // 事案カテゴリのngClassセット
  setCategoryClass(low: string, middle: string, high: string, category: string)
    : CategoryClass {
    const categoryClass = new CategoryClass(false, false, false);

    if (category === low) {
      categoryClass.low = true;
      categoryClass.middle = false;
      categoryClass.high = false;
    } else if (category === middle) {
      categoryClass.low = false;
      categoryClass.middle = true;
      categoryClass.high = false;
    } else if (category === high) {
      categoryClass.low = false;
      categoryClass.middle = false;
      categoryClass.high = true;
    }
    return categoryClass;
  }
}
