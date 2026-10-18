import { TestBed } from '@angular/core/testing';

import { Dormitories } from './dormitories';

describe('Dormitories', () => {
  let service: Dormitories;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dormitories);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
