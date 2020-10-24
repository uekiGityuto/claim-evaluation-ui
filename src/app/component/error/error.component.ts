import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * CE-S02事案一覧画面＜認可エラー＞のコンポーネント
 * @author SKK231527 植木
 */
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
    this.router.navigate(['list/error'], { queryParamsHandling: 'preserve' });
  }

}
