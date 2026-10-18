import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormitoryDetail } from './dormitory-detail';

describe('DormitoryDetail', () => {
  let component: DormitoryDetail;
  let fixture: ComponentFixture<DormitoryDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DormitoryDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DormitoryDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
