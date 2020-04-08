import { Component, OnInit } from '@angular/core';

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
      // theme: 'dracula',
      theme: 'panda-syntax',
      mode: 'text/x-python',
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      autoCloseBrackets: true,
      matchBrackets: true,
      lint: true
    };
  }

  ngOnInit(): void {
  }

  setEditorContentPython(event): void {
    // console.log(event, typeof event);
    console.log(this.dataPython);
  }
}
