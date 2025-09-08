import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponentService } from '../../services/base-component.service';

@Component({
  selector: 'app-query-builder-validator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <!-- Breadcrumb Navigation -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/adminconfiguration/baseconfiguration">Base Component</a></li>
          <li class="breadcrumb-item active" aria-current="page">Query Builder Validator</li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="page-header mb-4">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <h2 class="mb-2"><i class="fas fa-check-circle me-3"></i>Query Builder Validator</h2>
            <p class="mb-0 text-muted">Validate and test your component queries</p>
          </div>
          <button class="btn btn-secondary" (click)="goBack()">
            <i class="fas fa-arrow-left me-2"></i>Back to Components
          </button>
        </div>
      </div>

      <!-- Component Info -->
      <div class="card mb-4" *ngIf="componentId">
        <div class="card-header">
          <h5 class="mb-0"><i class="fas fa-info-circle me-2"></i>Component Information</h5>
        </div>
        <div class="card-body">
          <p><strong>Component ID:</strong> {{ componentId }}</p>
          <p class="text-muted">This component is currently being validated.</p>
        </div>
      </div>

      <!-- Placeholder Content -->
      <div class="card">
        <div class="card-body text-center py-5">
          <i class="fas fa-tools fa-3x text-muted mb-3"></i>
          <h4>Query Builder Validator</h4>
          <p class="text-muted mb-4">
            This feature is under development. It will allow you to validate and test component queries.
          </p>
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Coming Soon:</strong> Advanced query validation, testing tools, and performance analysis.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 8px;
    }
    
    .breadcrumb {
      background: transparent;
      padding: 0;
    }
    
    .breadcrumb-item a {
      color: #007bff;
      text-decoration: none;
    }
    
    .breadcrumb-item a:hover {
      text-decoration: underline;
    }
  `]
})
export class QueryBuilderValidatorComponent implements OnInit {
  componentId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private baseComponentService: BaseComponentService
  ) {}

  ngOnInit(): void {
    // Get component ID from service
    this.componentId = this.baseComponentService.getCurrentComponentData();
    
    // Also check route params as fallback
    this.route.queryParams.subscribe(params => {
      if (params['compid']) {
        this.componentId = +params['compid'];
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/adminconfiguration/baseconfiguration']);
  }
}
