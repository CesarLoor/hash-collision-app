import { TestBed } from '@angular/core/testing';

import { Hash } from './hash';

describe('Hash', () => {
  let service: Hash;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hash);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
