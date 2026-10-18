import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingOwners } from './pending-owners';

describe('PendingOwners', () => {
  let component: PendingOwners;
  let fixture: ComponentFixture<PendingOwners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingOwners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingOwners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
