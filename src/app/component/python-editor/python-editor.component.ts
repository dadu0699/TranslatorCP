import { Component, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service'
import { Report } from 'src/app/util/Report';

@Component({
  selector: 'app-python-editor',
  templateUrl: './python-editor.component.html',
  styleUrls: ['./python-editor.component.css']
})
export class PythonEditorComponent implements OnInit {
  public name: string;
  public codeMirrorPythonOptions: any;
  public pythonCode;

  constructor(private _data: DataService) {
    this.name = 'Python Properties';
    this.codeMirrorPythonOptions = {
      theme: 'dracula',
      mode: 'text/x-python',
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
    this._data.currentPython.subscribe(pythonCode => this.pythonCode = pythonCode);
  }

  saveDocument(): void {
    if (this.pythonCode) {
      let report: Report = new Report();
      report.writeContent(this.pythonCode, 'translation.py', 'text/python');
    }
  }
}
