import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdminDialog } from './create-admin-dialog';

describe('CreateAdminDialog', () => {
  let component: CreateAdminDialog;
  let fixture: ComponentFixture<CreateAdminDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAdminDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAdminDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
