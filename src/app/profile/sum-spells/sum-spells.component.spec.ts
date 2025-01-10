import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumSpellsComponent } from './sum-spells.component';

describe('SumSpellsComponent', () => {
  let component: SumSpellsComponent;
  let fixture: ComponentFixture<SumSpellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SumSpellsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SumSpellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
