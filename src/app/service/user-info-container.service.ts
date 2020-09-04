import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoContainerService {
  private _authFlag: boolean;
  private _userId: string;

  constructor() {
    this.authFlag = false;
    this.userId = '';
  }

  get authFlag(): boolean {
    return this._authFlag;
  }

  set authFlag(authFlag: boolean) {
    this._authFlag = authFlag;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(userId: string) {
    this._userId = userId;
  }
}
