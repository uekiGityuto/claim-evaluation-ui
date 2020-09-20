import { Reason } from '../model/reason';

export class RaiseLowerReason {

  private _raiseReason: Reason[];
  private _lowerReason: Reason[];

  constructor(
    raiseReason: Reason[] = [], lowerReason: Reason[] = []
  ) {
    this._raiseReason = raiseReason;
    this._lowerReason = lowerReason;
  }

  get raiseReason(): Reason[] {
    return this._raiseReason;
  }

  get lowerReason(): Reason[] {
    return this._lowerReason;
  }

}
