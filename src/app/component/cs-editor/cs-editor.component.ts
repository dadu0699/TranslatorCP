import { Component, OnInit } from '@angular/core';
import { LexicalAnalyzer } from 'src/app/analyzer/LexicalAnalyzer';
import { Token } from 'src/app/model/Token';
import { Report } from 'src/app/util/Report';

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
  private tokenList: Array<Token>;

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

    this.tokenList = [];
  }

  ngOnInit(): void {
  }

  analyze(): void {
    if (this.dataCS) {
      this.lex = new LexicalAnalyzer();
      this.lex.scanner(this.dataCS);
      this.tokenList = this.lex.getTokenList();

      let report: Report = new Report();
      report.generateTokenReport(this.tokenList);
    }
  }
}
