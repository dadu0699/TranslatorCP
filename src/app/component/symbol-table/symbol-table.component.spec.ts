import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolTableComponent } from './symbol-table.component';

describe('SymbolTableComponent', () => {
  let component: SymbolTableComponent;
  let fixture: ComponentFixture<SymbolTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymbolTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
