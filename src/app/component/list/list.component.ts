import { Component, OnInit } from '@angular/core';
import { Issue } from '../../model/Issue.model';
import { ObservableClientService } from '../../service/ObservableClientService';
import {Router, NavigationExtras} from "@angular/router";
import { Result } from '../../model/Result.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [ObservableClientService]
})
export class ListComponent implements OnInit {
  public list: Issue[];
  public err_msg_list: {key: string, value: string}[];

  constructor(
    private ob: ObservableClientService,
    private router: Router
  ) {}
  
  getCardList() {
    const uri = "http://localhost:3000/list";
    const method = "get";
    this.list = [];
    this.err_msg_list = [];

    let observer = this.ob.rxClient(uri , method);
    observer.subscribe(
      (result: Result) => {
        result.isSuccess ? this.list = result.data : this.err_msg_list = result.errMsgList;
      }
    );
  }

  ngOnInit(): void {
    this.getCardList();
  }


  onSubmit(param:any): void {
    const receiptNo = param.receiptNo.value;
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "issue": JSON.stringify({receipt_no: receiptNo})
      }
    };
    this.router.navigate(["detail"], navigationExtras);
  }

  // scrollInit() {
  //   alert("test");
  //   scrollTo(0, 0);
  // }
}
