import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from 'src/app/service/data.service'
import { Symbol } from 'src/app/model/Symbol';

@Component({
  selector: 'app-symbol-table',
  templateUrl: './symbol-table.component.html',
  styleUrls: ['./symbol-table.component.css']
})
export class SymbolTableComponent implements OnInit {
  displayedColumns: string[];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private _data: DataService) {
    this.displayedColumns = ['name', 'type', 'line'];
    this.dataSource = new MatTableDataSource<Symbol>();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this._data.currentSymbolTable.subscribe(
      symbolTable =>
        this.dataSource = symbolTable
    );
  }
}
