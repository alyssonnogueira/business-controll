import { Injectable } from '@angular/core';
import {DBConfig, ObjectStoreMeta} from 'ngx-indexed-db/lib/ngx-indexed-db.meta';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBConfigService implements DBConfig {

  migrationFactory: () => { [p: number]: (db: IDBDatabase, transaction: IDBTransaction) => void };
  name: string;
  // objectStoresMeta: ObjectStoreMeta[];
  version: number;

  constructor() {
    this.name = 'BusinessControll';
    this.version = 1;
  }

  get objectStoresMeta(): ObjectStoreMeta[] {
    return [
      {
        store: 'responsavel',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'nome', keypath: 'nome', options: { unique: false } },
        ]
      },
      {
        store: 'conta',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'nome', keypath: 'nome', options: { unique: false } },
          { name: 'saldo', keypath: 'saldo', options: { unique: false } },
          { name: 'saldoOriginal', keypath: 'saldoOriginal', options: { unique: false } },
          { name: 'responsavel', keypath: 'responsavel', options: { unique: false } },
          { name: 'tipoConta', keypath: 'tipoConta', options: { unique: false } },
        ]
      }, {
        store: 'transacao',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'data', keypath: 'data', options: { unique: false } },
          { name: 'valor', keypath: 'valor', options: { unique: false } },
          { name: 'descricao', keypath: 'descricao', options: { unique: false } },
          { name: 'responsavel', keypath: 'responsavel', options: { unique: false } },
          { name: 'conta', keypath: 'conta', options: { unique: false } },
          // Receita
          { name: 'tipoRenda', keypath: 'tipoRenda', options: { unique: false } },
          // Despesa
          { name: 'categoria', keypath: 'categoria', options: { unique: false } },
          // Transferencia
          { name: 'contaDestino', keypath: 'contaDestino', options: { unique: false } },
        ]
      }
    ];
  }
}
