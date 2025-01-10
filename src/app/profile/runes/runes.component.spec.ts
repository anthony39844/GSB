import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunesComponent } from './runes.component';

describe('RunesComponent', () => {
  let component: RunesComponent;
  let fixture: ComponentFixture<RunesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
