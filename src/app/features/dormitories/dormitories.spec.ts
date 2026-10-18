import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dormitories } from './dormitories';

describe('Dormitories', () => {
  let component: Dormitories;
  let fixture: ComponentFixture<Dormitories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dormitories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dormitories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
