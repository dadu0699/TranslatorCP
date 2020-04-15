import { Component, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service'
import { Report } from 'src/app/util/Report';

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.css']
})
export class HtmlEditorComponent implements OnInit {
  public name: string;
  public codeMirrorHTMLOptions: any;
  public htmlCode;

  constructor(private _data: DataService) {
    this.name = 'HTML Properties';
    this.codeMirrorHTMLOptions = {
      theme: 'dracula',
      mode: 'text/html',
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
    this._data.currentHTML.subscribe(htmlCode => this.htmlCode = htmlCode);
  }

  saveDocument(): void {
    if (this.htmlCode) {
      let report: Report = new Report();
      report.writeContent(this.htmlCode, 'translation.html', 'text/html');
    }
  }
}
