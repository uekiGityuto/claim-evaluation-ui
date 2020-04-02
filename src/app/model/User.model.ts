export class User {
    userId: string;
    name: string;
    password: string;
    role: number;
    // updateInterval: number;
    // initialDisplayInterval: number;

    constructor(userId: string,
                name: string,
                password: string,
                role: number) {
        this.userId = userId;
        this.name = name;
        this.password = password;
        this.role = role;
    }
}