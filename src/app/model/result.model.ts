export class Result {
  public data: any;
  public isSuccess: boolean;
  public errMsgList: { key: string, value: string; }[];

  constructor(
    data: any = null,
    isSuccess: boolean = false,
    errMsgList: { key: string, value: string; }[] = []
  ) {
    this.data = data;
    this.isSuccess = isSuccess;
    this.errMsgList = errMsgList;
  }

  addErrList(errMsgList: { key: string, value: string; }[]) {
    errMsgList.forEach(element => {
      this.errMsgList.push({ key: element.key, value: element.value });
    });
  }
}
