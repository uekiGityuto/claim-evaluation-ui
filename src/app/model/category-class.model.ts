export class CategoryClass {

  private _low: boolean;
  private _middle: boolean;
  private _high: boolean;

  constructor(low = false, middle = false, high = false) {
    this._low = low;
    this._middle = middle;
    this._high = high;
  }

  public get low(): boolean {
    return this._low;
  }

  public set low(low: boolean) {
    this._low = low;
  }

  public get middle(): boolean {
    return this._middle;
  }

  public set middle(middle: boolean) {
    this._middle = middle;
  }

  public get high(): boolean {
    return this._high;
  }

  public set high(high: boolean) {
    this._high = high;
  }

}
