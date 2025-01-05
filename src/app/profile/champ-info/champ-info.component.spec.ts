import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampInfoComponent } from './champ-info.component';

describe('ChampInfoComponent', () => {
  let component: ChampInfoComponent;
  let fixture: ComponentFixture<ChampInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
