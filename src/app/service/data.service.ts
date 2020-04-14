import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private pythonCode;
  public currentPython;

  constructor() {
    this.pythonCode = new BehaviorSubject('');
    this.currentPython = this.pythonCode.asObservable();
  }

  public changePythonCode(python: string): void {
    this.pythonCode.next(python);
  }
}
