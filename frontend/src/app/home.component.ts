import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="text-center">
        <h1 class="display-4 text-primary mb-4">
          <i class="fa fa-hashtag me-3"></i>Letz Buzz
        </h1>
        <p class="lead mb-4">Welcome to the Admin Configuration System</p>
        
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="card h-100 shadow-sm">
                  <div class="card-body text-center">
                    <i class="fa fa-user-shield fa-3x text-primary mb-3"></i>
                    <h5 class="card-title">Admin Panel</h5>
                    <p class="card-text">Access user management and authentication</p>
                    <a [routerLink]="['/admin/signin']" class="btn btn-primary">
                      <i class="fa fa-sign-in-alt me-2"></i>
                      &nbsp; Admin Login
                    </a>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="card h-100 shadow-sm">
                  <div class="card-body text-center">
                    <i class="fa fa-cogs fa-3x text-success mb-3"></i>
                    <h5 class="card-title">Configuration</h5>
                    <p class="card-text">Manage system configuration and settings</p>
                    <a [routerLink]="['/adminconfiguration']" class="btn btn-success">
                      <i class="fa fa-cog me-2"></i>
                      &nbsp; Configuration
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <small class="text-muted">
            <i class="fa fa-info-circle me-1"></i>
            Choose your access portal above
          </small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    .card {
      transition: transform 0.2s ease-in-out;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .fa-3x {
      font-size: 3rem;
    }
  `]
})
export class HomeComponent {
}
