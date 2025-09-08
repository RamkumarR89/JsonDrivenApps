import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { BaseComponentService, BaseComponent } from '../../../services/base-component.service';
import { BaseDefinitionService } from '../../../services/base-definition.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-base-configuration',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './base-configuration.component.html',
  styleUrls: ['./base-configuration.component.css']
})
export class BaseConfigurationComponent implements OnInit, OnDestroy {
  components: BaseComponent[] = [];
  loading = false;
  error: string | null = null;
  totalRows = 0;
  gridApi: GridApi | null = null;
  private readonly routerSubscription: Subscription = new Subscription();

  columnDefs: ColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80, 
      sortable: true,
      filter: true
    },
    { 
      field: 'componentName', 
      headerName: 'Component Name', 
      flex: 1, 
      sortable: true,
      filter: true
    },
    { 
      field: 'parentComponent', 
      headerName: 'Parent Component', 
      flex: 1, 
      sortable: true,
      filter: true
    },
    { 
      field: 'displayName', 
      headerName: 'Display Name', 
      flex: 1, 
      sortable: true,
      filter: true
    },
    { 
      field: 'isActive', 
      headerName: 'Active', 
      width: 100, 
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => {
        const isActive = params.value;
        const statusClass = isActive ? 'text-success' : 'text-danger';
        const statusIcon = isActive ? 'fa-check-circle' : 'fa-times-circle';
        const statusText = isActive ? 'Active' : 'Inactive';
        return `<span class="${statusClass}"><i class="fas ${statusIcon} me-1"></i>${statusText}</span>`;
      }
    },
    {
      headerName: 'Actions',
      width: 260,
      cellRenderer: (params: any) => {
        const component = params.data;
        return `
          <button class="btn btn-sm btn-outline-primary me-1" onclick="window.editComponent(${component.id})">Edit</button>
          <button class="btn btn-sm btn-outline-danger me-1" onclick="window.deleteComponent(${component.id})">Delete</button>
          <button class="btn btn-sm btn-outline-success" onclick="window.addDefinition(${component.id})">Add Definition</button>
        `;
      }
    }
  ];

  gridOptions = {
    columnDefs: this.columnDefs,
    rowData: this.components,
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [5, 10, 20, 50],
    domLayout: 'normal' as const,
    suppressHorizontalScroll: false,
    suppressRowHoverHighlight: false,
    rowHeight: 40,
    headerHeight: 40,
    animateRows: false, // Disable animations for faster rendering
    enableCellTextSelection: true,
    suppressMenuHide: true,
    suppressLoadingOverlay: true, // Faster loading
    suppressNoRowsOverlay: false,
    rowBuffer: 10, // Optimize row rendering
    rowSelection: 'single' as const, // Enable row selection for better UX
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
      suppressMovable: true // Prevent column moving for performance
    }
  };

  constructor(
    private readonly baseComponentService: BaseComponentService,
    private readonly router: Router,
    private readonly injector: Injector,
    private readonly baseDefinitionService: BaseDefinitionService
  ) {
    // Make methods available globally for AG Grid action buttons
    (window as any).editComponent = (id: number) => this.editComponent(id);
    (window as any).deleteComponent = (id: number) => this.deleteComponent(id);
      (window as any).addDefinition = (id: number) => this.addDefinition(id);
  }

    addDefinition(componentId: number) {
      console.log('addDefinition called with component ID:', componentId);
      
      // Set the component ID in the service before navigating
      // This approach matches how the old frontend was handling this
      this.baseDefinitionService.setComponentId(componentId);
      
      // Then navigate
      console.log('Navigating to:', '/adminconfiguration/basedefinition', { queryParams: { compid: componentId } });
      this.router.navigate(['/adminconfiguration/basedefinition'], { queryParams: { compid: componentId } });
      
      // Show an alert for testing purposes
      setTimeout(() => {
        alert('Navigation triggered to Base Definition for component ID: ' + componentId);
      }, 100);
    }

  ngOnInit(): void {
    console.log('BaseConfigurationComponent ngOnInit called');
    
    // Subscribe to the components observable from the service for real-time updates
    this.routerSubscription.add(
      this.baseComponentService.components$.subscribe(components => {
        console.log('Service components observable updated:', components.length);
        this.updateGridData(components);
      })
    );
    
    // Initial load only
    this.loadComponents();
    
    // Listen for router navigation events for returning to this page
    this.routerSubscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          // Only refresh if navigating back to list from create/edit pages
          if (event.url === '/adminconfiguration/baseconfiguration' && 
              event.url !== this.router.url) {
            console.log('Returned to base configuration list, triggering refresh...');
            this.baseComponentService.refreshComponents();
          }
        })
    );
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    console.log('Grid is ready');
    
    // Immediately set data if available
    if (this.components.length > 0) {
      this.gridApi.setGridOption('rowData', this.components);
      console.log('Grid initialized with existing data:', this.components.length, 'items');
    }
    
    // Size columns to fit
    this.gridApi.sizeColumnsToFit();
  }

  // Optimized method for updating grid data efficiently
  private updateGridData(components: BaseComponent[]): void {
    this.components = components;
    this.totalRows = components.length;
    this.loading = false;
    this.error = null;
    
    // Batch update the grid for better performance
    if (this.gridApi) {
      // Use transaction for better performance with large datasets
      this.gridApi.setGridOption('rowData', components);
      console.log('Grid data updated efficiently with', components.length, 'components');
    }
  }

  loadComponents(): void {
    console.log('LoadComponents called - fetching data from API...');
    this.loading = true;
    this.error = null;

    this.baseComponentService.getBaseComponents().subscribe({
      next: (components) => {
        console.log('Loaded components successfully:', components);
        // Update the service observable - this will trigger the subscription above
        this.baseComponentService.updateComponentsSubject(components);
      },
      error: (error) => {
        console.error('Error loading components:', error);
        this.error = `Failed to load components: ${error.message}. Loading sample data for demonstration.`;
        this.loading = false;
        
        // Load sample data as fallback
        const sampleData = this.getSampleData();
        this.baseComponentService.updateComponentsSubject(sampleData);
      }
    });
  }

  refreshGrid(): void {
    console.log('RefreshGrid called - triggering data refresh...');
    this.baseComponentService.refreshComponents();
  }

  createNewComponent() {
    this.router.navigate(['/adminconfiguration/baseconfiguration/create']);
  }

  editComponent(componentId: number) {
    this.router.navigate(['/adminconfiguration/baseconfiguration/edit', componentId]);
  }

  deleteComponent(id: number) {
    if (confirm('Are you sure you want to delete this component?')) {
      this.baseComponentService.deleteBaseComponent(id).subscribe({
        next: () => {
          console.log('Component deleted successfully');
          // Refresh the grid after deletion
          this.refreshGrid();
        },
        error: (error) => {
          console.error('Error deleting component:', error);
          alert('Failed to delete component. Please try again.');
        }
      });
    }
  }

  private getSampleData(): BaseComponent[] {
    return [
      {
        id: 1,
        componentName: 'Header',
        parentComponent: '0',
        displayName: 'Application Header',
        isActive: true
      },
      {
        id: 2,
        componentName: 'Navigation',
        parentComponent: '1',
        displayName: 'Main Navigation',
        isActive: true
      },
      {
        id: 3,
        componentName: 'Footer',
        parentComponent: '0',
        displayName: 'Application Footer',
        isActive: true
      },
      {
        id: 4,
        componentName: 'Content',
        parentComponent: '0',
        displayName: 'Main Content Area',
        isActive: true
      },
      {
        id: 5,
        componentName: 'Sidebar',
        parentComponent: '4',
        displayName: 'Content Sidebar',
        isActive: false
      },
      {
        id: 6,
        componentName: 'Login',
        parentComponent: '2',
        displayName: 'User Login Form',
        isActive: true
      }
    ];
  }
}
