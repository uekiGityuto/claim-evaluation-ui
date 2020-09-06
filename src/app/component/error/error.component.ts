import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const param = this.route.snapshot.queryParamMap.get('param');
    const userId = this.route.snapshot.queryParamMap.get('userId');
    console.log(this.route.snapshot);
    console.log(param, userId);
    this.router.navigate(['list/error'], { queryParamsHandling: 'preserve' });
    // this.router.navigate(['detail/error']);
  }

}
