import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LexicalAnalyzer } from 'src/app/analyzer/LexicalAnalyzer';
import { SyntacticAnalyzer } from 'src/app/analyzer/SyntacticAnalyzer';
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
  public synt: SyntacticAnalyzer;
  private tokenList: Array<Token>;

  constructor(private _snackBar: MatSnackBar) {
    this.name = 'CSharp Properties';
    this.codeMirrorCSOptions = {
      theme: 'dracula',
      mode: 'text/x-csharp',
      lineNumbers: true,
      lineWrapping: false,
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
      this._snackBar.open('Lexical analysis completed', 'close', { duration: 2000 });
      // report.generateTokenReport(this.tokenList);

      if (this.lex.getErrorList().length == 0) {
        this.synt = new SyntacticAnalyzer(this.tokenList);

        if (this.synt.getErrorList().length > 0) {
          this._snackBar.open('Syntactic errors', 'close', { duration: 2000 });
          report.generateErrorReport(this.synt.getErrorList());
        } else {
          this._snackBar.open('Syntactic analysis completed', 'close', { duration: 2000 });
        }

      } else {
        this._snackBar.open('Lexical errors', 'close', { duration: 2000 });
        report.generateErrorReport(this.lex.getErrorList());
      }
    }
  }
}
