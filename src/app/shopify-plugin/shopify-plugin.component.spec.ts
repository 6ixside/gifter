import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyPluginComponent } from './shopify-plugin.component';

describe('ShopifyPluginComponent', () => {
  let component: ShopifyPluginComponent;
  let fixture: ComponentFixture<ShopifyPluginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopifyPluginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopifyPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
