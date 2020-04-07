import { Timestamp } from 'rxjs';

export class List {
    claimId: string;
    userName: string;
    name: string;
    birthday: Date;
    kind: string;
    occurenceDate: Date;
    score: number;
    createDate: Date;
    updateDate: Date;

    constructor(receiptNo: string = '',
                userName: string = '',
                name: string = '',
                birthday: string = '',
                kind: string = '',
                occurenceDate: string = '',
                score: number = null) {
        this.userName = userName;
        this.claimId = receiptNo;
        this.name = name;
        this.birthday = new Date(birthday);
        this.kind = kind;
        this.occurenceDate = new Date(occurenceDate);
        this.score = score;
    }

    setRequestData(data: object) {
        this.userName = data['userName'.toString()];
        this.claimId = data['claimId'.toString()];
        this.name = data['name'.toString()];
        this.birthday = new Date(data['birthday'.toString()]);
        this.kind = data['kind'.toString()];
        this.occurenceDate = new Date(data['occurenceDate'.toString()]);
        this.score = data['score'.toString()];
        this.createDate = data['createDate'.toString()];
        this.updateDate = data['updateDate'.toString()];
    }

}
