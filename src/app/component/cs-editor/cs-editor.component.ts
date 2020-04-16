import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LexicalAnalyzer } from 'src/app/analyzer/LexicalAnalyzer';
import { SyntacticAnalyzer } from 'src/app/analyzer/SyntacticAnalyzer';
import { HTMLAnalyzer } from 'src/app/analyzer/HTMLAnalyzer';
import { Translator } from 'src/app/util/Translator';
import { PrettierHTML } from 'src/app/util/PrettierHTML';
import { Token } from 'src/app/model/Token';
import { Error } from 'src/app/model/Error';
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
  private errorList: Array<Error>;

  private file: File;

  @Output() newTab = new EventEmitter();

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
    this.errorList = [];
  }

  ngOnInit(): void {
  }

  analyze(): void {
    this._data.changeSymbolTable([]);
    this._data.changeHTMLCode('');
    this._data.changePythonCode('');
    this._data.changeJSONCode('');


    if (this.dataCS) {
      this.lexicalAnalyzer = new LexicalAnalyzer();
      this.lexicalAnalyzer.scanner(this.dataCS);
      this.tokenList = this.lexicalAnalyzer.getTokenList();
      this.errorList = this.lexicalAnalyzer.getErrorList();

      this._snackBar.open('Lexical analysis completed', 'close', { duration: 2000 });
      if (this.lexicalAnalyzer.getErrorList().length == 0) {
        this.syntacticAnalyzer = new SyntacticAnalyzer(this.tokenList);

        if (this.syntacticAnalyzer.getErrorList().length > 0) {
          this._snackBar.open('Syntactic errors', 'close', { duration: 2000 });
          this.errorList = this.syntacticAnalyzer.getErrorList();
        } else {
          this._snackBar.open('Syntactic analysis completed', 'close', { duration: 2000 });
          this._data.changeSymbolTable(this.syntacticAnalyzer.getSymbolTable());

          let htmlA: HTMLAnalyzer = new HTMLAnalyzer();
          htmlA.scanner(this.syntacticAnalyzer.getHTMLContent());

          if (htmlA.getErrorList().length == 0) {
            if (htmlA.getTokenList().length > 0) {
              let prettierHTML: PrettierHTML = new PrettierHTML(htmlA.getTokenList());
              this._data.changeHTMLCode(prettierHTML.getHTMLContent());
              this._data.changeJSONCode(prettierHTML.getTranslate());
            }
          } else {
            this.errorList = htmlA.getErrorList();
            this._snackBar.open('Errors in html input', 'close', { duration: 2000 });
          }

          let translator: Translator = new Translator(this.lexicalAnalyzer.getTokenList());
          this._data.changePythonCode(translator.getTranslate());
        }

      } else {
        this._snackBar.open('Lexical errors', 'close', { duration: 2000 });
      }
    }
  }

  tokensReport(): void {
    if (this.tokenList.length > 0) {
      let report: Report = new Report();
      report.generateTokenReport(this.tokenList);
    }
  }

  errorsReport(): void {
    if (this.errorList.length > 0) {
      let report: Report = new Report();
      report.generateErrorReport(this.errorList);
    }
  }

  fileChanged(e: any): void {
    this.file = e.target.files[0];
    this.uploadDocument();
  }

  uploadDocument(): void {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);
      this.dataCS = fileReader.result.toString();
    }
    fileReader.readAsText(this.file);
  }

  saveDocument(): void {
    if (this.dataCS) {
      let report: Report = new Report();
      report.writeContent(this.dataCS, 'CSharp.cs', 'text/CSharp');
    }
  }
}
