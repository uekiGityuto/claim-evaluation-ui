import { Component, OnInit } from '@angular/core';
import { Issue } from '../../model/Issue.model';
import { ActivatedRoute } from '@angular/router';
import { ObservableClientService } from '../../service/ObservableClientService';
import { Result } from '../../model/Result.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit {
  public issue: Issue;
  public err_msg_list = [];

  constructor(private route: ActivatedRoute,
              private ob: ObservableClientService) {
    this.route.queryParams.subscribe(params => {
      if(params["issue"]) {
        let object = JSON.parse(params["issue"]);
        object ? this.castToIsuue(object) : false;
      }
    });
  }

  getIssueInfo() {
    const uri = "http://localhost:3001/issue";
    const param = {"receipt_no": this.issue.receipt_no};
    const method = "get";
    this.issue = new Issue();
    this.err_msg_list = [];

    let observer = this.ob.rxClient(uri , method, param);
    observer.subscribe(
      (result: Result) => {
        result.isSuccess ? this.issue.setRequestData(result.data[0]) : this.err_msg_list = result.errMsgList;
      }
    );
  }

  castToIsuue(object:Issue):void {
    this.issue = object;
  }

  ngOnInit(): void {
    this.getIssueInfo();
  }

}
