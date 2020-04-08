import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cs-editor',
  templateUrl: './cs-editor.component.html',
  styleUrls: ['./cs-editor.component.css']
})
export class CsEditorComponent implements OnInit {
  constructor() { }

  name = 'Angular 6';
  codeMirrorOptions: any = {
    theme: 'dracula',
    mode: 'text/x-csharp',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };
  obj;

  ngOnInit(): void {
  }
  setEditorContent(event) {
    // console.log(event, typeof event);
    console.log(this.obj);
  }
}
