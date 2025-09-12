import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-common-ag-grid',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './common-ag-grid.component.html',
  styleUrls: ['./common-ag-grid.component.css']
})
export class CommonAgGridComponent implements OnInit {
  @Input() gridDefinitions: any[] = [];
  @Input() rowData: any[] = [];
  CopyrowData: any[] = [];

  @Output() cellClicked = new EventEmitter<any>();
  @Output() gridReady = new EventEmitter<GridReadyEvent>();

  columnDefs: ColDef[] = [];
  column: any;

  ngOnInit(): void {
    // If gridDefinitions are in AG Grid format, use them directly
    if (this.gridDefinitions && this.gridDefinitions.length > 0 && this.gridDefinitions[0].field && this.gridDefinitions[0].headerName) {
      this.columnDefs = this.gridDefinitions;
    } else {
      // fallback to previous logic if needed
      this.columnDefs = [];
      this.gridDefinitions.forEach((field) => {
        if (!field) return;
        let ctrlInfoJson;
        try {
          ctrlInfoJson = typeof field.ctrlInfoJson === 'string' ? JSON.parse(field.ctrlInfoJson) : field.ctrlInfoJson;
        } catch (error) {
          console.error('Error parsing ctrlInfoJson:', error);
          return;
        }
        const _ctrlNames = Array.isArray(ctrlInfoJson?.ctrlname) ? ctrlInfoJson.ctrlname[0] : ctrlInfoJson?.ctrlname;
        const _displayNames = Array.isArray(ctrlInfoJson?.displayname) ? ctrlInfoJson.displayname[0] : ctrlInfoJson?.displayname;
        if (!_ctrlNames || !_displayNames) {
          console.warn('Invalid column configuration for field:', field);
          return;
        } else {
          this.columnDefs.push({
            field: _ctrlNames,
            headerName: _displayNames || _ctrlNames,
            sortable: true,
            filter: true
          });
        }
      });
    }
    // rowData can be empty, that's fine
  }

  onGridReady(event: GridReadyEvent) {
    this.gridReady.emit(event);
  }

  onCellClicked(event: any) {
    this.cellClicked.emit(event);
  }
}
