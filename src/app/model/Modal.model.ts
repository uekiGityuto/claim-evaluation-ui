import { ObservableClientService } from '../service/ObservableClientService';

export class Modal {
    public id: string;
    public title: string;
    public isHeader: boolean;
    public header: string;
    public isMemo: boolean;
    public memo: string;
    public btnName: string;
    public width: number;
    public height: number;
    public callback: Function;
    public obj: any;
    public ob: ObservableClientService;

    constructor(
        id: string = "",
        title: string = "",
        isHeader: boolean = true,
        header: string = "",
        isMemo: boolean = true,
        memo: string = "",
        btnName: string = "確認",
        width: number = 0,
        height: number = 0,
        obj: any = null
    ) {
        this.id = id;
        this.title = title;
        this.isHeader = isHeader;
        this.header = header;
        this.isMemo = isMemo;
        this.memo = memo;
        this.btnName = btnName;
        this.width = width;
        this.height = height;
        this.obj = obj;
    }

    public setModel(model: Modal) {
        this.title = model.title;
        this.isHeader = model.isHeader;
        this.header = model.header;
        this.isMemo = model.isMemo;
        this.memo = model.memo;
        this.btnName = model.btnName;
        this.width = model.width;
        this.height = model.height;
        this.obj = model.obj;
    }
}
