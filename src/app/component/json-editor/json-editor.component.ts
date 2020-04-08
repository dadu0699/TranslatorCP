import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.css']
})
export class JsonEditorComponent implements OnInit {
  public name: string;
  public codeMirrorJSONOptions: any;
  public dataJSON;

  constructor() {
    this.name = 'JSON Properties';
    this.codeMirrorJSONOptions = {
      theme: 'dracula',
      // theme: 'panda-syntax',
      mode: 'application/json',
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      autoCloseBrackets: true,
      matchBrackets: true,
      lint: true,
      readOnly: true
    };
  }

  ngOnInit(): void {
    this.dataJSON = JSON.stringify({
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "title": "Object",
      "additionalProperties": false,
      "properties": {
        "string": {
          "type": "string",
          "title": "String"
        }
      }
    }, null, ' ');
  }

  setEditorContentJSON(event): void {
    // console.log(event, typeof event);
    console.log(this.dataJSON);
  }
}