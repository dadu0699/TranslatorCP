import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsEditorComponent } from './cs-editor.component';

describe('CsEditorComponent', () => {
  let component: CsEditorComponent;
  let fixture: ComponentFixture<CsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
