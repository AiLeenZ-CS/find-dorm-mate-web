import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthImage } from './auth-image';

describe('AuthImage', () => {
  let component: AuthImage;
  let fixture: ComponentFixture<AuthImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
