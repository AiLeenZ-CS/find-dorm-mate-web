import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectDormitoryDialog } from './reject-dormitory-dialog';

describe('RejectDormitoryDialog', () => {
  let component: RejectDormitoryDialog;
  let fixture: ComponentFixture<RejectDormitoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectDormitoryDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectDormitoryDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
