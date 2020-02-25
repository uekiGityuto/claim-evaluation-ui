export class Result {
    public data: any;
    public isSuccess: boolean;
    public errMsgList: {key: string, value: string}[];

    constructor(
        data: any = null,
        isSuccess: boolean = false,
        errMsgList: {key: string, value: string}[] = []
    ){
        this.data = data;
        this.isSuccess = isSuccess;
        this.errMsgList = errMsgList;
    }
}