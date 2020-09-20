import { Reason } from './reason';

export class RaiseLowerReason {

  raiseReason: Reason[];
  lowerReason: Reason[];

  constructor(
    raiseReason: Reason[] = [], lowerReason: Reason[] = []
  ) {
    this.raiseReason = raiseReason;
    this.lowerReason = lowerReason;
  }

}
