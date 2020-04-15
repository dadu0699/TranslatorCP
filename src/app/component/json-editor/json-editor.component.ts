import { Component, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service'
import { Report } from 'src/app/util/Report';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.css']
})
export class JsonEditorComponent implements OnInit {
  public name: string;
  public codeMirrorJSONOptions: any;
  public jsonCode;

  constructor(private _data: DataService) {
    this.name = 'JSON Properties';
    this.codeMirrorJSONOptions = {
      theme: 'dracula',
      mode: 'application/json',
      lineNumbers: true,
      lineWrapping: false,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      autoCloseBrackets: true,
      matchBrackets: true,
      lint: true,
      readOnly: true
    };
  }

  ngOnInit(): void {
    this._data.currentJSON.subscribe(jsonCode => this.jsonCode = jsonCode);
  }

  saveDocument(): void {
    if (this.jsonCode) {
      let report: Report = new Report();
      report.writeContent(this.jsonCode, 'translation.json', 'text/json');
    }
  }
}
