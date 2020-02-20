import { Component, OnInit } from '@angular/core';
import { Card } from '../model/Card.model';
import { HttpClientService } from '../service/http-client-service';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Router, NavigationExtras} from "@angular/router";

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css'],
  providers: [HttpClientService]
})

export class FirstComponent implements OnInit {
  public card_list: Card[];
  public message_list: {key:string}[];
  // public firstForm: FormGroup;

  getCardList() {
    let rtn = this.httpClientService.get("http://localhost:3000/cards","get")
    rtn.subscribe(result => {
          this.card_list = result;
      });
  }

  constructor(
    private httpClientService: HttpClientService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.getCardList();
    // this.firstForm = new FormGroup({
    //   id: new FormControl(this.card_list[0].id),
    //   title: new FormControl(this.card_list[0].title),
    //   description: new FormControl(this.card_list[0].description)
    // });
    // this.firstForm = new FormGroup({
    //   id: new FormControl(-1, [Validators.required, Validators.min(1), Validators.max(999999), Validators.pattern("^[0-9]*$")]),
    //   title: new FormControl("", [Validators.required,　Validators.minLength(3)]),
    //   description: new FormControl("", [Validators.minLength(5)])
    // });
  }

  onSubmit(param:Card): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "id": param.id,
          "title": param.title,
          "description": param.description
      }
    };
    this.router.navigate(["detail"], navigationExtras);
  }
}
