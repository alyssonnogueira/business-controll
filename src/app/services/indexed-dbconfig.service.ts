import { Injectable } from '@angular/core';
import {DBConfig, ObjectStoreMeta} from 'ngx-indexed-db/lib/ngx-indexed-db.meta';
import { Conta } from '../model/conta';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBConfigService implements DBConfig {

  migrationFactory?: () => {
    [p: number]: (db: IDBDatabase, transaction: IDBTransaction) => void;
  };

  name: string;
  version: number;

  constructor() {
    this.name = 'BusinessControll';
    this.version = 4;
    this.migrationFactory = migrationFactory;
  }

  get objectStoresMeta(): ObjectStoreMeta[] {
    return [
      {
        store: 'responsavel',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'nome', keypath: 'nome', options: { unique: false } },
          { name: 'dataExclusao', keypath: 'dataExclusao', options: { unique: false } },
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
          { name: 'dataCriacao', keypath: 'dataCriacao', options: { unique: false } },
          { name: 'dataExclusao', keypath: 'dataExclusao', options: { unique: false } },
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
          { name: 'tipoTransacao', keypath: 'tipoTransacao', options: { unique: false } },
        ]
      }
    ];
  }
}

export function migrationFactory() {
  return {
    1: (db: IDBDatabase, transaction: IDBTransaction) => {
      const store = transaction.objectStore('transacao');
      store.createIndex('tipoTransacao', 'tipoTransacao', { unique: false });
      return;
    },
    2: (db: IDBDatabase, transaction: IDBTransaction) => {
      const store = transaction.objectStore('conta');
      store.createIndex('dataCriacao', 'dataCriacao', { unique: false });
      store.getAll().onsuccess = (event) => {
        (event.target as IDBRequest).result.forEach((conta: Conta) => {
          conta.dataCriacao = new Date('04/01/2020');
          store.put(conta);
        });
      };
      return;
    },
    3: (db: IDBDatabase, transaction: IDBTransaction) => {
      const store = transaction.objectStore('conta');
      store.createIndex('dataExclusao', 'dataExclusao', { unique: false });
      return;
    },
    4: (db: IDBDatabase, transaction: IDBTransaction) => {
      const store = transaction.objectStore('responsavel');
      store.createIndex('dataExclusao', 'dataExclusao', { unique: false });
      return;
    }
  };
}
