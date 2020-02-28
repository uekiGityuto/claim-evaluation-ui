import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { HttpHandler, HttpClient} from '@angular/common/http';
import { ObservableClientService } from '../../service/ObservableClientService';
import { ActivatedRoute } from '@angular/router';

describe('ListComponent', () => {
  let component: ListComponent;
  // let fixture: ComponentFixture<ListComponent>;
  let handler: jasmine.SpyObj<HttpHandler>;
  const http = new HttpClient(handler);
  const ob = new ObservableClientService(http);
  const router = jasmine.createSpyObj('router', ['navigate']);

  const fakeActivatedRoute = {
    snapshot: { data: {} }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      providers: [ { provide: ActivatedRoute, useClass: fakeActivatedRoute }, HttpClient ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    component = new ListComponent(ob, router);
  })
  
  it('一覧画面用データ取得テスト', () => {
    spyOn(component, 'getList');
    expect(component.errMsgList.length).toBe(0);
  });

});
