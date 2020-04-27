import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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

  private screenHeight: number;
  private screenWidth: number;

  constructor(private _data: DataService) {
    this.onResize();
    // this.page_size = ((this.screenHeight * 0.78) - 70);
    // this.pageSizeOptions = [this.page_size];
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

  @HostListener('window:resize', ['$event'])
  onResize(even?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    var size = (((this.screenHeight * 0.89) - 70) / 36).toFixed()
    this.page_size = Number(size);
    this.pageSizeOptions = [this.page_size];
  }
}
