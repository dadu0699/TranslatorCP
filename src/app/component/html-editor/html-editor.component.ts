import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.css']
})
export class HtmlEditorComponent implements OnInit {
  public name: string;
  public codeMirrorHTMLOptions: any;
  public dataHTML;

  constructor() {
    this.name = 'HTML Properties';
    this.codeMirrorHTMLOptions = {
      theme: 'dracula',
      // theme: 'panda-syntax',
      mode: 'text/html',
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
    this.dataHTML = ("<html>\n\t<head>\n\t\t<meta charset =\"UTF-8\">"
      + "\n\t\t<title>Page Title</title>\n\t</head>\n\t<body>\n\t\t"
      + "<h1>This is a Heading</h1>\n\t\t<p>This is a paragraph.</p>\n\t</body>\n</html>");
  }

  setEditorContentHTML(event): void {
    // console.log(event, typeof event);
    console.log(this.dataHTML);
  }
}
