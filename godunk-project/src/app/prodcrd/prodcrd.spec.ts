import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prodcrd } from './prodcrd';

describe('Prodcrd', () => {
  let component: Prodcrd;
  let fixture: ComponentFixture<Prodcrd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prodcrd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prodcrd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
