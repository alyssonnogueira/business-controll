import { TestBed } from '@angular/core/testing';

import { IndexedDBConfigService } from './indexed-dbconfig.service';

describe('IndexedDBConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndexedDBConfigService = TestBed.get(IndexedDBConfigService);
    expect(service).toBeTruthy();
  });
});
