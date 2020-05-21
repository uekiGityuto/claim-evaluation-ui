import { Timestamp } from 'rxjs';
import { create } from 'domain';

export class Comment {
    id: number;
    claimId: string;
    comment: string;
    userId: string;
    userName: string;
    createDate: Date;
    updateDate: Date;
    constructor(
        id: number = -1,
        claimId: string = '',
        comment: string = '',
        userId: string = '',
        userName: string = '',
        createDate: Date = null,
        updateDate: Date = null
    ) {
        this.id = id;
        this.claimId = claimId;
        this.comment = comment;
        this.userId = userId;
        this.userName = userName;
        this.createDate = createDate;
        this.updateDate = updateDate;
    }

    setRequestsData(data: Object) {
        this.id = data['id'.toString()];
        this.claimId = data['claimId'.toString()];
        this.comment = data['comment'.toString()];
        this.userId = data['userId'.toString()];
        this.userName = data['userName'.toString()];
        this.createDate = data['createDate'.toString()];
        this.updateDate = data['updateDate'.toString()];
    }
}
