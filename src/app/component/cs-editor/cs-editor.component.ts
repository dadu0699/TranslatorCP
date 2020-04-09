import { Component, OnInit } from '@angular/core';
import { LexicalAnalyzer } from 'src/app/analyzer/LexicalAnalyzer';

@Component({
  selector: 'app-cs-editor',
  templateUrl: './cs-editor.component.html',
  styleUrls: ['./cs-editor.component.css']
})
export class CsEditorComponent implements OnInit {
  public name: string;
  public codeMirrorCSOptions: any;
  public dataCS;
  public lex: LexicalAnalyzer;

  constructor() {
    this.name = 'CSharp Properties';
    this.codeMirrorCSOptions = {
      theme: 'dracula',
      // theme: 'panda-syntax',
      mode: 'text/x-csharp',
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      autoCloseBrackets: true,
      matchBrackets: true,
      lint: true
    };

    this.lex = new LexicalAnalyzer();
  }

  ngOnInit(): void {
  }
  setEditorContentCS(event): void {
    // console.log(event, typeof event);
    // console.log(this.dataCS);
    this.lex.scanner(this.dataCS);
  }
}
