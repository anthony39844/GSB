import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverTooltipComponent } from './hover-tooltip.component';

describe('HoverTooltipComponent', () => {
  let component: HoverTooltipComponent;
  let fixture: ComponentFixture<HoverTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverTooltipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoverTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
