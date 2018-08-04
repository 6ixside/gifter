import { TestBed, inject } from '@angular/core/testing';

import { ShopifyService } from './shopify.service';

describe('ShopifyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShopifyService]
    });
  });

  it('should be created', inject([ShopifyService], (service: ShopifyService) => {
    expect(service).toBeTruthy();
  }));
});
