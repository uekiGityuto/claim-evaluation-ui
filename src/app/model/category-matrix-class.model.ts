export class CategoryMatrixClass {

  private _now: boolean;

  constructor(now = false) {
    this._now = now;
  }

  public get now(): boolean {
    return this._now;
  }

  public set now(now: boolean) {
    this._now = now;
  }

}
