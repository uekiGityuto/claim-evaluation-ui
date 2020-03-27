import { Timestamp } from 'rxjs';

export class Comment {
    claimId: string;
    idx: string;
    comment: string;
    userName: string;
    createDate: Timestamp<Date>;
    updateDate: Timestamp<Date>;

    constructor(
        claimId: string = '',
        idx: string = '',
        comment: string = '',
        userName: string = '',
        createDate: string = '',
        updateDate: string = ''
    ) {
        this.claimId = claimId;
        this.idx = idx;
        this.comment = comment;
        this.userName = userName;
        this.createDate.value = new Date(createDate);
        this.updateDate.value = new Date(updateDate);
    }

    setRequestsData(data: Object) {
        this.claimId = data['claimId'.toString()];
        this.idx = data['idx'.toString()];
        this.comment = data['comment'.toString()];
        this.userName = data['userName'.toString()];
        this.createDate = data['createDate'.toString()];
        this.updateDate = data['updateDate'.toString()];
    }
}