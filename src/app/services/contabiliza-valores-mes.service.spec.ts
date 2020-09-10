import { TestBed } from '@angular/core/testing';

import { BalancoService } from './balanco.service';

describe('ContabilizaValoresMesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BalancoService = TestBed.get(BalancoService);
    expect(service).toBeTruthy();
  });
});
