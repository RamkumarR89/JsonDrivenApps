import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponentService, BaseComponent, CreateBaseComponentRequest } from '../../services/base-component.service';

@Component({
  selector: 'app-create-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-component.component.html',
  styleUrls: ['./create-component.component.css']
})
export class CreateComponentComponent implements OnInit {
  loading = false;
  error: string | null = null;
  success: string | null = null;
  editingComponent: BaseComponent | null = null;
  isEditMode = false;
  
  newComponent: Partial<BaseComponent> = {
    componentName: '',
    parentComponent: '',
    displayName: '',
    isActive: true
  };

  constructor(
    private readonly baseComponentService: BaseComponentService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if we're in edit mode
    const componentId = this.route.snapshot.params['id'];
    if (componentId) {
      this.isEditMode = true;
      this.loadComponent(componentId);
    }
  }

  loadComponent(id: number) {
    this.loading = true;
    this.baseComponentService.getBaseComponent(id).subscribe({
      next: (component) => {
        console.log('Loaded component for editing:', component);
        this.editingComponent = component;
        
        // Ensure all properties are properly set, especially the active status
        this.newComponent = {
          componentName: component.componentName,
          parentComponent: component.parentComponent || '',
          displayName: component.displayName,
          isActive: component.isActive === true // Explicitly ensure boolean value
        };
        
        console.log('Component form data set:', this.newComponent);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading component:', error);
        this.error = 'Failed to load component for editing.';
        this.loading = false;
      }
    });
  }

  // Handle active status checkbox change
  onActiveChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newComponent.isActive = target.checked;
    console.log('Active status changed to:', this.newComponent.isActive);
  }

  saveComponent() {
    if (!this.newComponent.componentName || !this.newComponent.displayName) {
      this.error = 'Component Name and Display Name are required.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const componentData: CreateBaseComponentRequest = {
      componentName: this.newComponent.componentName,
      parentComponent: this.newComponent.parentComponent || '',
      displayName: this.newComponent.displayName,
      isActive: this.newComponent.isActive || false
    };

    if (this.isEditMode && this.editingComponent) {
      // Update existing component - include the id in the payload
      const updateData: BaseComponent = {
        id: this.editingComponent.id,
        componentName: componentData.componentName,
        parentComponent: componentData.parentComponent || '',
        displayName: componentData.displayName,
        isActive: componentData.isActive
      };
      
      console.log('Sending update request:', updateData);
      console.log('Update URL:', `http://localhost:5135/api/Basecomponent/${this.editingComponent.id}`);
      
      this.baseComponentService.updateBaseComponent(this.editingComponent.id, updateData).subscribe({
        next: (updatedComponent) => {
          console.log('Component updated successfully:', updatedComponent);
          this.success = 'Component updated successfully!';
          this.loading = false;
          
          // Clear cache and refresh the components list in the service for fastest update
          this.baseComponentService.clearCache();
          this.baseComponentService.refreshComponents();
          
          // Redirect to list after 1.5 seconds
          setTimeout(() => {
            this.router.navigate(['/adminconfiguration/baseconfiguration']);
          }, 1500);
        },
        error: (error) => {
          console.error('Update error:', error);
          console.error('Error details:', error.error);
          this.error = `Failed to update component: ${error.message || 'Unknown error'}`;
          this.loading = false;
        }
      });
    } else {
      // Create new component
      this.baseComponentService.createBaseComponent(componentData).subscribe({
        next: (newComponent) => {
          console.log('Component created successfully:', newComponent);
          this.success = 'Component created successfully!';
          this.loading = false;
          
          // Clear cache and refresh the components list in the service for fastest update
          this.baseComponentService.clearCache();
          this.baseComponentService.refreshComponents();
          
          // Redirect to list after 1.5 seconds
          setTimeout(() => {
            this.router.navigate(['/adminconfiguration/baseconfiguration']);
          }, 1500);
        },
        error: (error) => {
          console.error('Create error:', error);
          this.error = `Failed to create component: ${error.message}`;
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    // Clear any pending form state
    this.error = null;
    this.success = null;
    this.loading = false;
    
    // Navigate back to list immediately
    this.router.navigate(['/adminconfiguration/baseconfiguration']);
  }

  goBackToList() {
    this.cancel(); // Reuse the cancel logic
  }

  resetForm() {
    if (this.isEditMode && this.editingComponent) {
      // Reset to original editing values
      this.newComponent = {
        componentName: this.editingComponent.componentName,
        parentComponent: this.editingComponent.parentComponent || '',
        displayName: this.editingComponent.displayName,
        isActive: this.editingComponent.isActive === true
      };
    } else {
      // Reset to default new component values
      this.newComponent = {
        componentName: '',
        parentComponent: '',
        displayName: '',
        isActive: true
      };
    }
    this.error = null;
    this.success = null;
    console.log('Form reset, active status:', this.newComponent.isActive);
  }
}
