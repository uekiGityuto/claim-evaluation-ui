import { Component, OnInit } from '@angular/core';
import { List } from '../../model/List.model';
import { ObservableClientService } from '../../service/ObservableClientService';
import {Router, NavigationExtras} from '@angular/router';
import { Result } from '../../model/Result.model';
import { environment } from '../../../environments/environment';
import { FilterPipe } from '../../module/filter.pipe';
import { AppComponent } from '../../app.component';

/**
 * 一覧画面
 * @author SKK231099 李
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public list: List[];
  public listSize: number;
  private fp: FilterPipe;
  private filterHistory: Map<string, string>;

  constructor(private ob: ObservableClientService,
              private router: Router,
              private appCmpt: AppComponent) {
    this.list = [];
    this.listSize = null;
    this.filterHistory = new Map();
  }

  public getList() {
    const uri = environment.restapi_url + "/scores";
    const method = 'get';
    this.list = [];
    this.appCmpt.result.errMsgList = [];

    const observer = this.ob.rxClient(uri , method);
    observer.subscribe(
      (result: Result) => {
        if (result.isSuccess) {
          this.list = result.data;
          this.listSize = this.list.length;
        } else {
          this.appCmpt.result.addErrList(result.errMsgList);
        }
      }
    );
  }

  public sort(name) {
    let asc = '';
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
    const claimId = param.claimId.value;
    const navigationExtras: NavigationExtras = {
      queryParams: {
          claimId: claimId
      }
    };
    this.router.navigate(['detail'], navigationExtras);
  }
}
