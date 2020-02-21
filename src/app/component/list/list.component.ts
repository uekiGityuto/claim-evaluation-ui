import { Component, OnInit } from '@angular/core';
import { Card } from '../../model/Card.model';
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
  public card_list: Card[];
  public err_msg_list: {key: string, value: string}[];
  public tempData: Card;

  constructor(
    private obClientService: ObservableClientService,
    private router: Router
  ) {}
  
  getCardList() {
    const uri = "http://localhost:3000/cards";
    const method = "get";
    this.card_list = [];

    let observer = this.obClientService.rxClient(uri , method);
    observer.subscribe(
      (result: Result) => {
        result.isSuccess ? this.card_list = result.data : this.err_msg_list = result.errMsgList;
      }
    );
  }

  ngOnInit(): void {
    this.getCardList();
  }


  onSubmit(param:any): void {
    const card = this.setRequestValue("card", param);
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "card": JSON.stringify(card)
      }
    };
    this.router.navigate(["detail"], navigationExtras);
  }

  setRequestValue(modelName, param) {
    switch(modelName) {
      case "card":
        let card = new Card(param.id.value,
                            param.title.value,
                            param.description.value,
                            "","");
        return card;
    }
  }

}
