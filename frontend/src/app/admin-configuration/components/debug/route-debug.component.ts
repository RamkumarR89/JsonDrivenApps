import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaseDefinitionService } from '../../services/base-definition.service';

@Component({
  selector: 'app-route-debug',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h3>Route Debugging Tool</h3>
        </div>
        <div class="card-body">
          <h4>Test Base Definition Navigation</h4>
          <div class="form-group mb-3">
            <label for="componentId">Component ID</label>
            <input type="number" id="componentId" class="form-control" [(ngModel)]="componentId">
          </div>
          <button class="btn btn-primary" (click)="testNavigation()">Test Navigation</button>
          
          <hr>
          
          <h4>Current Route Info</h4>
          <p><strong>Current URL:</strong> {{ router.url }}</p>
          
          <hr>
          
          <h4>All Routes</h4>
          <ul class="list-group">
            <li class="list-group-item" *ngFor="let route of routes">
              <a [routerLink]="route.path">{{ route.path }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class RouteDebugComponent implements OnInit {
  componentId = 1;
  routes = [
    { path: '/adminconfiguration/baseconfiguration' },
    { path: '/adminconfiguration/basedefinition' },
    { path: '/adminconfiguration/route-test' },
    { path: '/adminconfiguration/debug' }
  ];

  constructor(
    public router: Router,
    private readonly baseDefinitionService: BaseDefinitionService
  ) {}

  ngOnInit(): void {
    console.log('Debug component initialized');
  }

  testNavigation(): void {
    console.log('Testing navigation with component ID:', this.componentId);
    this.baseDefinitionService.setComponentId(this.componentId);
    this.router.navigate(['/adminconfiguration/basedefinition'], { 
      queryParams: { compid: this.componentId }
    });
  }
}
