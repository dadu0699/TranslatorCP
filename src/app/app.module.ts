import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// External Libraries
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './app.component';
import { CsEditorComponent } from './component/cs-editor/cs-editor.component';
import { PythonEditorComponent } from './component/python-editor/python-editor.component';
import { HtmlEditorComponent } from './component/html-editor/html-editor.component';
import { JsonEditorComponent } from './component/json-editor/json-editor.component';
import { SymbolTableComponent } from './component/symbol-table/symbol-table.component';
import { PaginatePipe } from './pipes/paginate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CsEditorComponent,
    PythonEditorComponent,
    HtmlEditorComponent,
    JsonEditorComponent,
    SymbolTableComponent,
    PaginatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CodemirrorModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
