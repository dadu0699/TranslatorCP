import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from 'src/app/service/data.service'
import { Symbol } from 'src/app/model/Symbol';

@Component({
  selector: 'app-symbol-table',
  templateUrl: './symbol-table.component.html',
  styleUrls: ['./symbol-table.component.css']
})
export class SymbolTableComponent implements OnInit {
  page_size: number;
  page_number: number;
  pageSizeOptions: number[];
  displayedColumns: string[];
  dataSource: any;

  constructor(private _data: DataService) {
    this.page_size = 14;
    this.pageSizeOptions = [this.page_size];
    this.page_number = 1;
    this.displayedColumns = ['name', 'type', 'line'];
    this.dataSource = new MatTableDataSource<Symbol>();
  }

  ngOnInit(): void {
    this._data.currentSymbolTable.subscribe(
      symbolTable =>
        this.dataSource = symbolTable,
    );
  }

  handlePage(event: PageEvent): void {
    this.page_size = event.pageSize;
    this.page_number = event.pageIndex + 1;
  }
}
