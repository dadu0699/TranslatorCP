import { Component, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TranslatorCP';
  pythonCode: string;

  constructor(private _data: DataService) { }

  ngOnInit() {
    this._data.currentPython.subscribe(pythonCode => this.pythonCode = pythonCode);
  }
}
