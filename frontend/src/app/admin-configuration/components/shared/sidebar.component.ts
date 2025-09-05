import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchicalMenuComponent } from './hierarchical-menu.component';
import { HierarchicalMenuService, HierarchicalMenuItem } from '../../services/hierarchical-menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, HierarchicalMenuComponent],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">
          <i class="fa fa-hashtag me-2"></i>ConfigHub
        </h3>
      </div>
      
      <div class="sidebar-menu">
        <div class="menu-section">
          <div class="menu-section-title">
            <i class="fas fa-tachometer-alt me-2"></i>
            Navigation
          </div>
          
          <!-- Static menu items -->
          <div class="menu-item" (click)="navigateToBaseConfiguration()">
            <i class="fas fa-cogs me-2"></i>
            Base Component
          </div>
          
          <div class="menu-item" (click)="navigateToMasterConfiguration()">
            <i class="fas fa-crown me-2"></i>
            Master Component
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-section-title">
            <i class="fas fa-sitemap me-2"></i>
            Component Tree
          </div>
          
          <!-- Dynamic Hierarchical Menu -->
          <div class="hierarchical-menu-container">
            <hierarchical-menu
              [menuItems]="hierarchicalMenu"
              (menuItemClick)="onMenuClick($event)">
            </hierarchical-menu>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      background: #f8f9fa;
      height: 100vh;
      border-right: 1px solid #dee2e6;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    
    .sidebar-header {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid #dee2e6;
      background: #fff;
    }
    
    .sidebar-title {
      margin: 0;
      color: #007bff;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .sidebar-menu {
      flex: 1;
      padding: 1rem 0;
    }
    
    .menu-section {
      margin-bottom: 1.5rem;
    }
    
    .menu-section-title {
      padding: 0.5rem 1rem;
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #e9ecef;
      margin: 0 0.5rem 0.5rem 0.5rem;
      border-radius: 4px;
    }
    
    .menu-item {
      padding: 0.75rem 1rem;
      margin: 0.25rem 0.5rem;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
      color: #495057;
    }
    
    .menu-item:hover {
      background-color: rgba(0, 123, 255, 0.1);
      color: #0056b3;
    }
    
    .hierarchical-menu-container {
      padding: 0 0.5rem;
    }
    
    /* Custom scrollbar for sidebar */
    .sidebar::-webkit-scrollbar {
      width: 6px;
    }
    
    .sidebar::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    .sidebar::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    
    .sidebar::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class SidebarComponent implements OnInit {
  hierarchicalMenu: HierarchicalMenuItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private hierarchicalMenuService: HierarchicalMenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHierarchicalMenu();
  }

  loadHierarchicalMenu(): void {
    this.loading = true;
    this.error = null;

    this.hierarchicalMenuService.getHierarchicalMenu().subscribe({
      next: (menu) => {
        console.log('Hierarchical menu loaded:', menu);
        this.hierarchicalMenu = menu;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hierarchical menu:', error);
        this.error = 'Failed to load menu structure';
        this.loading = false;
        
        // Load sample data as fallback
        this.loadSampleMenuData();
      }
    });
  }

  private loadSampleMenuData(): void {
    // Sample data based on the backend seed data structure
    this.hierarchicalMenu = [
      {
        id: '16',
        name: 'Home',
        parentComponent: '0',
        isMaster: false,
        icon: 'far fa-file-alt me-2',
        routerUrl: '/adminconfiguration/jsonformviewer',
        children: [
          {
            id: '2',
            name: 'EMP Detail',
            parentComponent: '16',
            isMaster: false,
            icon: 'far fa-file-alt me-2',
            routerUrl: '/adminconfiguration/baseconfiguration'
          },
          {
            id: '14',
            name: 'Contract Detail',
            parentComponent: '16',
            isMaster: false,
            icon: 'far fa-file-alt me-2',
            routerUrl: '/adminconfiguration/baseconfiguration'
          },
          {
            id: '15',
            name: 'Register Form',
            parentComponent: '16',
            isMaster: false,
            icon: 'far fa-file-alt me-2',
            routerUrl: '/adminconfiguration/baseconfiguration'
          },
          {
            id: '17',
            name: 'addition cost',
            parentComponent: '16',
            isMaster: false,
            icon: 'far fa-file-alt me-2',
            routerUrl: '/adminconfiguration/baseconfiguration'
          },
          {
            id: '19',
            name: 'Nat Habbit',
            parentComponent: '16',
            isMaster: false,
            icon: 'far fa-file-alt me-2',
            routerUrl: '/adminconfiguration/baseconfiguration'
          },
          {
            id: '22',
            name: 'Boutique',
            parentComponent: '16',
            isMaster: false,
            icon: 'far fa-file-alt me-2',
            routerUrl: '/adminconfiguration/baseconfiguration'
          }
        ]
      },
      {
        id: '23',
        name: 'Grid',
        parentComponent: '0',
        isMaster: false,
        icon: 'far fa-file-alt me-2',
        routerUrl: '/adminconfiguration/baseconfiguration',
        children: [
          {
            id: '18',
            name: 'AG GRID List',
            parentComponent: '23',
            isMaster: false,
            icon: 'far fa-file-alt me-2',
            routerUrl: '/adminconfiguration/baseconfiguration'
          },
          {
            id: '20',
            name: 'Mobile Model',
            parentComponent: '23',
            isMaster: false,
            icon: 'far fa-file-alt me-2',
            routerUrl: '/adminconfiguration/baseconfiguration'
          },
          {
            id: '21',
            name: 'AG GRID Common',
            parentComponent: '23',
            isMaster: false,
            icon: 'far fa-file-alt me-2',
            routerUrl: '/adminconfiguration/baseconfiguration'
          }
        ]
      },
      {
        id: '25',
        name: 'Master Test',
        parentComponent: '0',
        isMaster: true,
        icon: 'far fa-file-alt me-2',
        routerUrl: '/adminconfiguration/baseconfiguration'
      },
      {
        id: '26',
        name: 'Vessel Detail',
        parentComponent: '0',
        isMaster: false,
        icon: 'far fa-file-alt me-2',
        routerUrl: '/adminconfiguration/baseconfiguration'
      }
    ];
  }

  navigateToBaseConfiguration(): void {
    this.router.navigate(['/adminconfiguration/baseconfiguration']);
  }

  navigateToMasterConfiguration(): void {
    this.router.navigate(['/adminconfiguration/masterconfiguration']);
  }

  onMenuClick(item: HierarchicalMenuItem): void {
    console.log('Menu item clicked:', item);
    
    if (item.routerUrl) {
      // Navigate based on the component type
      if (item.isMaster) {
        // Navigate to master data view
        this.router.navigate(['/adminconfiguration/masterdata', item.id]);
      } else {
        // Navigate to base data view
        this.router.navigate(['/adminconfiguration/basedata', item.id]);
      }
    } else {
      console.warn('No router URL defined for item:', item);
    }
  }
}
