import { Component, OnInit } from '@angular/core';
import { Report } from 'src/app/util/Report';

@Component({
  selector: 'app-python-editor',
  templateUrl: './python-editor.component.html',
  styleUrls: ['./python-editor.component.css']
})
export class PythonEditorComponent implements OnInit {
  public name: string;
  public codeMirrorPythonOptions: any;
  public dataPython;

  constructor() {
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
    this.dataPython = ("def my_function():\n\tprint(\"Hello from a function\")");
  }

  setEditorContentPython(event): void {
    // console.log(event, typeof event);
    console.log(this.dataPython);
  }

  saveDocument(): void {
    if (this.dataPython) {
      let report: Report = new Report();
      report.writeContent(this.dataPython, 'translation.py', 'text/python');
    }
  }
}
