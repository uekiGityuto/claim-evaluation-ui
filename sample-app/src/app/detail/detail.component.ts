import { Component, OnInit } from '@angular/core';
import { Card } from '../model/Card.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  constructor(public card: Card) { }

  ngOnInit(): void {
  }

}
