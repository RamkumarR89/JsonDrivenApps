import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { Router, ActivatedRoute } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { BaseDefinitionService } from '../../services/base-definition.service';
import { BaseDefinition } from '../../models/base-definition.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-base-definition',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './base-definition.component.html',
  styleUrls: ['./base-definition.component.css']
})
export class BaseDefinitionComponent implements OnInit {
  rowData: BaseDefinition[] = [];
  loading = false;
  error: string | null = null;
  componentId: number | null = null;
  private subscription = new Subscription();
    definitionId: number | null = null;

  columnDefs: ColDef[] = [
    {
      headerName: 'Id',
      field: 'id',
      sortable: true,
      sortingOrder: ['desc', 'asc', null],
      filter: true,
      cellRenderer: (params: ICellRendererParams) => {
        return `<a href="/adminconfiguration/addrupdatedefinition/${params.data.id}">${params.data.id}</a>`;
      }
    },
    { headerName: 'Component Id', field: 'componentId', sortable: true },
    {
      headerName: 'Control Group Json',
      field: 'ctrlGroupJson',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? `<pre>${JSON.stringify(params.value, null, 2)}</pre>` : '';
      }
    },
    {
      headerName: 'Control Info Json',
      field: 'ctrlInfoJson',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? `<pre>${JSON.stringify(params.value, null, 2)}</pre>` : '';
      }
    },
    {
      headerName: 'Control Properties Json',
      field: 'ctrlPropertiesJson',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? `<pre>${JSON.stringify(params.value, null, 2)}</pre>` : '';
      }
    },
    {
      headerName: 'Control Source Json',
      field: 'ctrlSourceJson',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? `<pre>${JSON.stringify(params.value, null, 2)}</pre>` : '';
      }
    },
    {
      headerName: 'IsActive',
      field: 'isActive',
      sortable: true,
      minWidth: 175,
      cellRenderer: (params: { value: boolean; }) => {
        const imageUrl = params.value
          ? 'assets/images/active-icon.png'  // Replace with actual image URLs
          : 'assets/images/inactive-icon.png';

        return `<img src="${imageUrl}" alt="${params.value ? 'Active' : 'Inactive'}" width="80px" height="30px">`;
      }
    },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params: any) => {
        const definition = params.data;
        return `
          <button class='btn btn-sm btn-outline-primary me-1' onclick='window.editDefinition(${definition.id})'>Edit</button>
          <button class='btn btn-sm btn-outline-danger' onclick='window.deleteDefinition(${definition.id})'>Delete</button>
        `;
      }
    }
  ];

  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
    suppressMovable: true
  };

  public sortingOrder: any[] = ['desc', 'asc', null];
  gridApi: GridApi | null = null;

  constructor(
    private readonly router: Router,
    private route: ActivatedRoute,
    private baseDefinitionService: BaseDefinitionService
  ) {}

    ngOnInit(): void {
      // Attach add/edit/delete to window for AG Grid cellRenderer
      (window as any).addDefinition = () => this.addDefinition();
      (window as any).editDefinition = (id: number) => this.editDefinition(id);
      (window as any).deleteDefinition = (id: number) => this.deleteDefinition(id);

      // Listen for both route params and query params
      this.subscription.add(
        this.route.params.subscribe(params => {
          this.definitionId = params['id'] ? +params['id'] : null;
        })
      );
      this.subscription.add(
        this.route.queryParams.subscribe(params => {
          this.componentId = params['compid'] ? +params['compid'] : null;
          this.loadData();
        })
      );

      // Subscribe to definitions from the service
      this.subscription.add(
        this.baseDefinitionService.definitions$.subscribe(definitions => {
          this.rowData = definitions;
          this.updateGrid();
        })
      );
    }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.updateGrid();
  }

  private updateGrid(): void {
    if (this.gridApi && this.rowData) {
      this.gridApi.setGridOption('rowData', this.rowData);
      this.gridApi.sizeColumnsToFit();
    }
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;
    if (this.definitionId) {
      // Load only the definition with this ID
      this.baseDefinitionService.getDefinitionById(this.definitionId).subscribe({
        next: (definition) => {
          // Optionally filter by componentId if present
          if (this.componentId && definition.componentId !== this.componentId) {
            this.rowData = [];
            this.error = `No definition found for ID ${this.definitionId} and component ID ${this.componentId}`;
          } else {
            this.rowData = [definition];
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = `Failed to load definition for ID ${this.definitionId}: ${err.message}`;
          this.rowData = [];
          this.loading = false;
        }
      });
    } else if (this.componentId) {
      this.baseDefinitionService.setComponentId(this.componentId);
      this.baseDefinitionService.getDefinitionsByComponentId(this.componentId).subscribe({
        next: (definitions) => {
          this.loading = false;
          if (definitions.length === 0) {
            this.error = `No definitions found for component ID ${this.componentId}`;
          }
        },
        error: (err) => {
          this.error = `Failed to load definitions for component ID ${this.componentId}: ${err.message}`;
          this.loading = false;
          this.loadMockDefinitions();
        }
      });
    } else {
      this.baseDefinitionService.getBaseDefinitions().subscribe({
        next: () => {
          this.loading = false;
        },
        error: (err) => {
          this.error = `Failed to load definitions: ${err.message}`;
          this.loading = false;
          this.loadMockDefinitions();
        }
      });
    }
  }

  loadAllDefinitions(): void {
    this.loading = true;
    this.error = null;

    this.baseDefinitionService.getBaseDefinitions().subscribe({
      next: (definitions) => {
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to load definitions: ${err.message}`;
        this.loading = false;
        this.loadMockDefinitions();
      }
    });
  }

  loadDefinitionsByComponentId(): void {
    if (!this.componentId) return;
    
    this.loading = true;
    this.error = null;

    this.baseDefinitionService.getDefinitionsByComponentId(this.componentId).subscribe({
      next: (definitions) => {
        this.loading = false;
        if (definitions.length === 0) {
          this.error = `No definitions found for component ID ${this.componentId}`;
        }
      },
      error: (err) => {
        this.error = `Failed to load definitions for component ID ${this.componentId}: ${err.message}`;
        this.loading = false;
        this.loadMockDefinitions();
      }
    });
  }

  // Load mock data if API fails
  private loadMockDefinitions(): void {
    const mockDefinitions: BaseDefinition[] = [
      {
        id: 1,
        componentId: 1,
        isActive: true,
        ctrlGroupJson: { ctrlgroupname: 'Group 1', groupsequence: 1 },
        ctrlInfoJson: { ctrlname: 'Control 1', ctrltype: 'textbox', displayname: 1 },
        ctrlPropertiesJson: { isrequired: true, ctrlsize: 12 },
        ctrlSourceJson: { lookupname: 'Lookup 1' }
      },
      {
        id: 2,
        componentId: 1,
        isActive: false,
        ctrlGroupJson: { ctrlgroupname: 'Group 2', groupsequence: 2 },
        ctrlInfoJson: { ctrlname: 'Control 2', ctrltype: 'dropdown', displayname: 2 },
        ctrlPropertiesJson: { isrequired: false, ctrlsize: 6 },
        ctrlSourceJson: { lookupname: 'Lookup 2' }
      }
    ];

    // If a component ID is specified, filter the mock data
    const filteredDefinitions = this.componentId
      ? mockDefinitions.filter(d => d.componentId === this.componentId)
      : mockDefinitions;

    // Use the mock data directly
    this.rowData = filteredDefinitions;
    this.updateGrid();
  }

  public addDefinition(): void {
    this.router.navigate(['/adminconfiguration/addrupdatedefinition'], {
      queryParams: { compid: this.componentId }
    });
  }

  private editDefinition(id: number): void {
    this.router.navigate(['/adminconfiguration/addrupdatedefinition', id], {
      queryParams: { compid: this.componentId }
    });
  }

  private deleteDefinition(id: number): void {
    if (confirm('Are you sure you want to delete this definition?')) {
      this.baseDefinitionService.deleteBaseDefinition(id).subscribe({
        next: () => {
          alert('Definition deleted successfully');
          this.loadData();
        },
        error: (err: any) => {
          console.error('Error deleting definition:', err);
          alert('Failed to delete definition');
        }
      });
    }
  }

  goToCreateDefinition(): void {
    const queryParams = this.componentId ? { compid: this.componentId } : {};
    this.router.navigate(['/adminconfiguration/addrupdatedefinition'], { queryParams });
  }

  goToBaseData(componentId: number): void {
    this.router.navigate(['/adminconfiguration/basedata', componentId]);
  }
}
