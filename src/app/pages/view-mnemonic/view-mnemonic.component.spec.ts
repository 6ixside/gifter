import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMnemonicComponent } from './view-mnemonic.component';

describe('ViewMnemonicComponent', () => {
  let component: ViewMnemonicComponent;
  let fixture: ComponentFixture<ViewMnemonicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMnemonicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMnemonicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
