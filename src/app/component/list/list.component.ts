import { Component, OnInit } from '@angular/core';
import { Issue } from '../../model/Issue.model';
import { ObservableClientService } from '../../service/ObservableClientService';
import {Router, NavigationExtras} from '@angular/router';
import { Result } from '../../model/Result.model';
import { environment } from '../../../environments/environment';
import { FilterPipe } from '../../module/filter.pipe';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public list: Issue[];
  public errMsgList: {key: string, value: string}[];
  private fp: FilterPipe;
  private filterHistory: Map<string, string>;

  constructor(private ob: ObservableClientService,
              private router: Router) {
    this.list = [];
    this.errMsgList = [];
    this.filterHistory = new Map();
  }

  public getList() {
    const uri = environment.list_url;
    const method = 'get';
    this.list = [];
    this.errMsgList = [];

    const observer = this.ob.rxClient(uri , method);
    observer.subscribe(
      (result: Result) => {
        result.isSuccess ? this.list = result.data : this.errMsgList = result.errMsgList;
      }
    );
  }

  public sort(name) {
    let asc = "";
    if (this.filterHistory.has(name)) {
      if (this.filterHistory.get(name) === "asc") {
        asc = 'desc';
      } else {
        asc = 'asc';
      }
    } else {
      asc = 'asc';
    }
    this.filterHistory.set(name, asc);
    this.fp.transform(this.list, 'sort', [name, asc]);
  }

  ngOnInit(): void {
    this.fp = new FilterPipe();
    this.getList();
  }

  onSubmit(param: any): void {
    const receiptNo = param.receiptNo.value;
    const navigationExtras: NavigationExtras = {
      queryParams: {
          issue: JSON.stringify({receipt_no: receiptNo})
      }
    };
    this.router.navigate(['detail'], navigationExtras);
  }
}
