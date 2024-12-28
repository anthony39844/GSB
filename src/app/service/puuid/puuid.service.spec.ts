import { TestBed } from '@angular/core/testing';

import { PuuidService } from './puuid.service';

describe('PuuidService', () => {
  let service: PuuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuuidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
