import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Symbol } from 'src/app/model/Symbol';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private pythonCode;
  public currentPython;

  private symbolTable;
  public currentSymbolTable;

  constructor() {
    this.pythonCode = new BehaviorSubject('');
    this.currentPython = this.pythonCode.asObservable();

    this.symbolTable = new BehaviorSubject([]);
    this.currentSymbolTable = this.symbolTable.asObservable();
  }

  public changePythonCode(python: string): void {
    this.pythonCode.next(python);
  }

  public changeSymbolTable(symbolTable: Array<Symbol>): void {
    this.symbolTable.next(symbolTable);
  }
}
