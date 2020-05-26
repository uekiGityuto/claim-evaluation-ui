import { Timestamp } from 'rxjs';

export class Claim {
    claimId: string;
    userName: string;
    name: string;
    birthday: Date;
    kind: string;
    occurenceDate: Date;
    createDate: Date;
    updateDate: Date;

    commentList: Comment[];

    constructor(ClaimId: string = '',
                userName: string = '',
                name: string = '',
                birthday: string = '',
                kind: string = '',
                occurenceDate: string = '',
                createDate: string = '',
                updateDate: string = '',
                commentList: Comment[] = []) {
        this.userName = userName;
        this.claimId = ClaimId;
        this.name = name;
        this.birthday = new Date(birthday);
        this.kind = kind;
        this.occurenceDate = new Date(occurenceDate);
        this.createDate = new Date(createDate);
        this.updateDate = new Date(updateDate);
        this.commentList = commentList;
    }

    setRequestData(data: object) {
        this.userName = data['userName'.toString()];
        this.claimId = data['claimId'.toString()];
        this.name = data['name'.toString()];
        this.birthday = new Date(data['birthday'.toString()]);
        this.kind = data['kind'.toString()];
        this.occurenceDate = new Date(data['occurenceDate'.toString()]);
        this.createDate = data['createDate'.toString()];
        this.updateDate = data['updateDate'.toString()];
        this.commentList = data['commentList'.toString()];
    }

}
