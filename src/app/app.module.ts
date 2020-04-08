import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// External Libraries
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { AppComponent } from './app.component';
import { CsEditorComponent } from './component/cs-editor/cs-editor.component';
import { PythonEditorComponent } from './component/python-editor/python-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    CsEditorComponent,
    PythonEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CodemirrorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
