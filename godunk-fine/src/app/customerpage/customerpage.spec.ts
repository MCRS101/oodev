import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customerpage } from './customerpage';

describe('Customerpage', () => {
  let component: Customerpage;
  let fixture: ComponentFixture<Customerpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Customerpage],
    }).compileComponents();

    fixture = TestBed.createComponent(Customerpage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
