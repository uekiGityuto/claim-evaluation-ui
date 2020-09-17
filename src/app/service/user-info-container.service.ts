import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoContainerService {
  authFlag: boolean;
  userId: string;

  constructor() {
    this.authFlag = false;
    this.userId = '';
  }
}
