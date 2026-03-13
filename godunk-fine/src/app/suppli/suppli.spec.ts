import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Suppli } from './suppli';

describe('Suppli', () => {
  let component: Suppli;
  let fixture: ComponentFixture<Suppli>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Suppli],
    }).compileComponents();

    fixture = TestBed.createComponent(Suppli);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
