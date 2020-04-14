import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LexicalAnalyzer } from 'src/app/analyzer/LexicalAnalyzer';
import { SyntacticAnalyzer } from 'src/app/analyzer/SyntacticAnalyzer';
import { Translator } from 'src/app/util/Translator';
import { Token } from 'src/app/model/Token';
import { Report } from 'src/app/util/Report';
import { DataService } from 'src/app/service/data.service'

@Component({
  selector: 'app-cs-editor',
  templateUrl: './cs-editor.component.html',
  styleUrls: ['./cs-editor.component.css']
})
export class CsEditorComponent implements OnInit {
  private name: string;
  public codeMirrorCSOptions: any;
  public dataCS: string;
  private lexicalAnalyzer: LexicalAnalyzer;
  private syntacticAnalyzer: SyntacticAnalyzer;
  private tokenList: Array<Token>;
  private pythonCode;

  constructor(private _snackBar: MatSnackBar, private _data: DataService) {
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
      this.lexicalAnalyzer = new LexicalAnalyzer();
      this.lexicalAnalyzer.scanner(this.dataCS);
      this.tokenList = this.lexicalAnalyzer.getTokenList();

      let report: Report = new Report();
      this._snackBar.open('Lexical analysis completed', 'close', { duration: 2000 });
      // report.generateTokenReport(this.tokenList);

      if (this.lexicalAnalyzer.getErrorList().length == 0) {
        this.syntacticAnalyzer = new SyntacticAnalyzer(this.tokenList);

        if (this.syntacticAnalyzer.getErrorList().length > 0) {
          this._snackBar.open('Syntactic errors', 'close', { duration: 2000 });
          report.generateErrorReport(this.syntacticAnalyzer.getErrorList());
        } else {
          this._snackBar.open('Syntactic analysis completed', 'close', { duration: 2000 });

          this._data.changeSymbolTable(this.syntacticAnalyzer.getSymbolTable());

          let translator: Translator = new Translator(this.lexicalAnalyzer.getTokenList());
          this._data.changePythonCode(translator.getTranslate());
        }

      } else {
        this._snackBar.open('Lexical errors', 'close', { duration: 2000 });
        report.generateErrorReport(this.lexicalAnalyzer.getErrorList());
      }
    }
  }
}
