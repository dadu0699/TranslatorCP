import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// External Libraries
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppComponent } from './app.component';
import { CsEditorComponent } from './component/cs-editor/cs-editor.component';
import { PythonEditorComponent } from './component/python-editor/python-editor.component';
import { HtmlEditorComponent } from './component/html-editor/html-editor.component';
import { JsonEditorComponent } from './component/json-editor/json-editor.component';
import { SymbolTableComponent } from './component/symbol-table/symbol-table.component';

@NgModule({
  declarations: [
    AppComponent,
    CsEditorComponent,
    PythonEditorComponent,
    HtmlEditorComponent,
    JsonEditorComponent,
    SymbolTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CodemirrorModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
