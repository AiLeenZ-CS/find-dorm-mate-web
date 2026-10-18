import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectOwnerDialog } from './reject-owner-dialog';

describe('RejectOwnerDialog', () => {
  let component: RejectOwnerDialog;
  let fixture: ComponentFixture<RejectOwnerDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectOwnerDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectOwnerDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
