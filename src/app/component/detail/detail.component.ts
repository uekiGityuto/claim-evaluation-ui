import { Component, OnInit } from '@angular/core';
import { Card } from '../../model/Card.model';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  public card;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if(params["card"]) {
        let object = JSON.parse(params["card"]);
        object ? this.castToCard(object) : false;
      }
    });
  }

  castToCard(object:Card):void {
    this.card = object;
  }

  ngOnInit(): void {

  }

}
