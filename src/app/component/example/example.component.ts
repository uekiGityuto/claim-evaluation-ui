import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  title = 'Move to SAML Login page';

  constructor() { }

  ngOnInit(): void {
  }

}
