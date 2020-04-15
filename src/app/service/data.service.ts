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

  private htmlCode;
  public currentHTML;

  constructor() {
    this.pythonCode = new BehaviorSubject('');
    this.currentPython = this.pythonCode.asObservable();

    this.symbolTable = new BehaviorSubject([]);
    this.currentSymbolTable = this.symbolTable.asObservable();

    this.htmlCode = new BehaviorSubject('');
    this.currentHTML = this.htmlCode.asObservable();
  }

  public changePythonCode(python: string): void {
    this.pythonCode.next(python);
  }

  public changeSymbolTable(symbolTable: Array<Symbol>): void {
    this.symbolTable.next(symbolTable);
  }

  public changeHTMLCode(htmlCode: string): void {
    this.htmlCode.next(htmlCode);
  }
}
