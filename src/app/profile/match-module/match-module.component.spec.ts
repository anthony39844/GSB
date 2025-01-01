import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchModuleComponent } from './match-module.component';

describe('MatchModuleComponent', () => {
  let component: MatchModuleComponent;
  let fixture: ComponentFixture<MatchModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
