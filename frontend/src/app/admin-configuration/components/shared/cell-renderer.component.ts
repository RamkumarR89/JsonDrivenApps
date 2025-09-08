import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { BaseComponentService } from '../../services/base-component.service';
import { AdminapiService } from '../../../admin/services/adminapi.service';

@Component({
  selector: 'app-cell-renderer',
  standalone: true,
  template: `
    <div class="d-flex align-items-center gap-2">
      <button 
        class="btn btn-warning btn-sm" 
        (click)="onClickEdit(value)"
        title="Edit Component">
        <i class="fas fa-edit me-1"></i>Edit
      </button>
      <button 
        class="btn btn-primary btn-sm" 
        (click)="onClickDefinition(value)"
        title="View Definitions">
        <i class="fas fa-list me-1"></i>Definition
      </button>
      <button 
        class="btn btn-danger btn-sm" 
        (click)="onClick(value)"
        title="Delete Component">
        <i class="fas fa-trash me-1"></i>Delete
      </button>
      <button 
        class="btn btn-success btn-sm" 
        (click)="onClickQueryBuilderValidator(value)"
        title="Open Validator">
        <i class="fas fa-check-circle me-1"></i>Validator
      </button>
    </div>
  `,
  styles: [`
    .btn-sm {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
    .gap-2 {
      gap: 0.5rem;
    }
  `]
})
export class CellRendererComponent implements OnInit, ICellRendererAngularComp {
  value: any;
  currentRoute: string = '';

  constructor(
    private router: Router,
    private baseComponentService: BaseComponentService,
    private adminapiService: AdminapiService
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.value = params.data.id;
  }

  onClick(val: any) {
    if (confirm('Are you sure you want to delete component ' + val + '?')) {
      this.baseComponentService.deleteBaseComponent(val).subscribe({
        next: (response) => {
          if (!response) {
            alert('Component deleted successfully!');
            const redirectRoute = this.currentRoute.includes('masterbaseconfiguration')
              ? '/adminconfiguration/masterbaseconfiguration'
              : '/adminconfiguration/baseconfiguration';

            this.router.navigateByUrl(redirectRoute);
            window.location.reload();
          }
        },
        error: (error) => {
          console.error('Error deleting component:', error);
          alert('Failed to delete component. Please try again.');
        }
      });
    }
  }

  onClickDefinition(componentId: any) {
    this.baseComponentService.setComponentData(componentId);
    this.adminapiService.setComponentId(componentId);

    const redirectRoute = this.currentRoute.includes('masterbaseconfiguration')
      ? '/adminconfiguration/masterbasedefinition'
      : '/adminconfiguration/basedefinition';

    this.router.navigate([redirectRoute]);
  }

  onClickEdit(componentId: any) {
    this.baseComponentService.setComponentData(componentId);
    this.adminapiService.setComponentId(componentId);

    const redirectRoute = this.currentRoute.includes('masterbaseconfiguration')
      ? '/adminconfiguration/masterbaseconfiguration/edit/' + componentId
      : '/adminconfiguration/baseconfiguration/edit/' + componentId;

    this.router.navigate([redirectRoute]);
  }

  onClickQueryBuilderValidator(componentId: any) {
    this.baseComponentService.setComponentData(componentId);
    this.adminapiService.setComponentId(componentId);

    const redirectRoute = this.currentRoute.includes('masterbaseconfiguration')
      ? '/adminconfiguration/masterquerybuildervalidator'
      : '/adminconfiguration/querybuildervalidator';

    this.router.navigate([redirectRoute]);
  }
}
