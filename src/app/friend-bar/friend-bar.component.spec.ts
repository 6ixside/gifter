import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendBarComponent } from './friend-bar.component';

describe('FriendBarComponent', () => {
  let component: FriendBarComponent;
  let fixture: ComponentFixture<FriendBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
