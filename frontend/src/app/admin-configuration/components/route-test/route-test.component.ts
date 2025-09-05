import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-route-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="alert alert-info">
        <h3>Route Test Component</h3>
        <p>Current URL: <strong>{{ router.url }}</strong></p>
        <p>Component ID from query params: <strong>{{ componentId || 'None' }}</strong></p>
        
        <button class="btn btn-primary mt-3" (click)="testAddDefinition(1)">
          Test Add Definition for Component ID: 1
        </button>
      </div>
    </div>
  `
})
export class RouteTestComponent implements OnInit {
  componentId: string | null = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get component ID from query params
    this.route.queryParams.subscribe(params => {
      this.componentId = params['compid'] || null;
    });
  }

  testAddDefinition(id: number): void {
    console.log(`Navigating to base definition with component ID: ${id}`);
    this.router.navigate(['/adminconfiguration/basedefinition'], { queryParams: { compid: id } });
  }
}
