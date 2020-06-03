import { stringify } from 'querystring';

export class User {
    userId: string;
    name: string;
    password: string;
    role: number;
    // updateInterval: number;
    // initialDisplayInterval: number;

    constructor(userId: string = '',
                name: string = '',
                password: string = '',
                role: number = null) {
        this.userId = userId;
        this.name = name;
        this.password = password;
        this.role = role;
    }

    setRequestsData(data: object) {
      this.userId = data['userId'.toString()];
      this.name = data['name'.toString()];
      this.password = data['password'.toString()];
      this.role = data['role'.toString()];
    }
}
