export class CategoryMatrix {

  private _highHigh: string;
  private _highMiddle: string;
  private _highLow: string;
  private _middleHigh: string;
  private _middleMiddle: string;
  private _middleLow: string;
  private _lowHigh: string;
  private _lowMiddle: string;
  private _lowLow: string;

  constructor(
    highHigh = '', highMiddle = '', highLow = '',
    middleHigh = '', middleMiddle = '', middleLow = '',
    lowHigh = '', lowMiddle = '', lowLow = '',
  ) {
    this._highHigh = highHigh;
    this._highMiddle = highMiddle;
    this._highLow = highLow;
    this._middleHigh = middleHigh;
    this._middleMiddle = middleMiddle;
    this._middleLow = middleLow;
    this._lowHigh = lowHigh;
    this._lowMiddle = lowMiddle;
    this._lowLow = lowLow;
  }

  get highHigh(): string {
    return this._highHigh;
  }

  get highMiddle(): string {
    return this._highMiddle;
  }

  get highLow(): string {
    return this._highLow;
  }

  get middleHigh(): string {
    return this._middleHigh;
  }

  get middleMiddle(): string {
    return this._middleMiddle;
  }

  get middleLow(): string {
    return this._middleLow;
  }

  get lowHigh(): string {
    return this._lowHigh;
  }

  get lowMiddle(): string {
    return this._lowMiddle;
  }

  get lowLow(): string {
    return this._lowLow;
  }

}
