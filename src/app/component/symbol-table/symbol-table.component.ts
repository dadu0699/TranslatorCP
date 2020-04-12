import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Symbol } from 'src/app/model/Symbol';

@Component({
  selector: 'app-symbol-table',
  templateUrl: './symbol-table.component.html',
  styleUrls: ['./symbol-table.component.css']
})
export class SymbolTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'line'];
  dataSource = new MatTableDataSource<Symbol>(ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() { }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}

const ELEMENT_DATA: Array<Symbol> = [
  new Symbol(1, 'int', 'a', '', 1),
  new Symbol(2, 'int', 'b', '', 2),
  new Symbol(3, 'int', 'c', '', 3),
  new Symbol(4, 'int', 'd', '', 4),
  new Symbol(5, 'int', 'e', '', 5),
];
