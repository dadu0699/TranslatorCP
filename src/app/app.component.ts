import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TranslatorCP';
  tabs = ['CSHARP'];
  selected = new FormControl(0);

  constructor() { }

  ngOnInit() {
  }

  addTab() {
    this.tabs.push('New');
    this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
