import { Timestamp } from 'rxjs';
import { create } from 'domain';

export class Comment {
    claimId: string;
    idx: number;
    comment: string;
    userId: string;
    userName: string;
    createDate: Timestamp<Date>;
    updateDate: Timestamp<Date>;
    constructor(
        claimId: string = '',
        idx: number = null,
        comment: string = '',
        userId: string = '',
        userName: string = '',
        createDate: Timestamp<Date> = null,
        updateDate: Timestamp<Date> = null,
    ) {
        this.claimId = claimId;
        this.idx = idx;
        this.comment = comment;
        this.userId = userId;
        this.userName = userName;
        this.createDate = createDate;
        this.updateDate = updateDate;
    }

    setRequestsData(data: Object) {
        this.claimId = data['claimId'.toString()];
        this.idx = data['idx'.toString()];
        this.comment = data['comment'.toString()];
        this.userId = data['userId'.toString()];
        this.userName = data['userName'.toString()];
        this.createDate = data['createDate'.toString()];
        this.updateDate = data['updateDate'.toString()];
    }
}