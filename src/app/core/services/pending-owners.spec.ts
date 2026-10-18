import { TestBed } from '@angular/core/testing';

import { PendingOwners } from './pending-owners';

describe('PendingOwners', () => {
  let service: PendingOwners;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingOwners);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
