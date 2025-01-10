import { TestBed } from '@angular/core/testing';

import { MatchInfoService } from './match-info.service';

describe('MatchInfoService', () => {
  let service: MatchInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
