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
  public errMsgList = [];

  constructor(private route: ActivatedRoute,
              private ob: ObservableClientService) {
    // let receipt_no : string = this.route.snapshot.paramMap.get('receipt_no');
    // if(receipt_no) {
    //   this.issue = new Issue(receipt_no);
    //   this.issue.receipt_no = receipt_no;
    // } else {
      this.route.queryParams.subscribe(params => {
        if (params['receipt_no'.toString()]) {
          this.issue.receipt_no = params['receipt_no'.toString()];
        } else if (params['issue'.toString()]) {
          const object = JSON.parse(params['issue'.toString()]);
          if (object) {
            this.castToIsuue(object);
          }
        }
      });
    // }
  }

  getIssueInfo() {
    const uri = 'http://localhost:3001/issue';
    const param = {receipt_no: this.issue.receipt_no};
    const method = 'get';
    this.issue = new Issue();
    this.errMsgList = [];

    const observer = this.ob.rxClient(uri , method, param);
    observer.subscribe(
      (result: Result) => {
        result.isSuccess ? this.issue.setRequestData(result.data[0]) : this.errMsgList = result.errMsgList;
      }
    );
  }

  castToIsuue(object: Issue): void {
    this.issue = object;
  }

  ngOnInit(): void {
    this.getIssueInfo();
  }

}
