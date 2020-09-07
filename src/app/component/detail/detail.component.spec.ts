import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { ObservableClientService } from '../../service/observable-client.service';
import { ActivatedRoute } from '@angular/router';

describe('DetailComponent', () => {
  let component: DetailComponent;
  // let fixture: ComponentFixture<DetailComponent>;
  let handler: jasmine.SpyObj<HttpHandler>;
  const http = new HttpClient(handler);
  const ob = new ObservableClientService(http);
  const router = jasmine.createSpyObj('router', ['navigate']);

  const fakeActivatedRoute = {
    snapshot: { data: {} }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailComponent],
      providers: [{ provide: ActivatedRoute, useClass: fakeActivatedRoute }, HttpClient],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    // component = new DetailComponent(ob, router)
  });

  it('詳細画面用データ取得テスト', () => {
    component.claim.claimId = '00000865432';
    spyOn(component, 'getClaimInfo');
    expect(component.errMsgList.length).toBe(0);
  });
});
