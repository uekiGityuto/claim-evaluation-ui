export class CategoryClass {

  public low: boolean;
  public middle: boolean;
  public high: boolean;

  constructor(low = false, middle = false, high = false) {
    this.low = low;
    this.middle = middle;
    this.high = high;
  }

}
