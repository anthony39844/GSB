import { TestBed } from '@angular/core/testing';

import { SumSpellsService } from './sum-spells.service';

describe('SumSpellsService', () => {
  let service: SumSpellsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SumSpellsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
