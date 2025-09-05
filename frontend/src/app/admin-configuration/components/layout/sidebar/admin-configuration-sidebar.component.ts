import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HierarchicalMenuService, HierarchicalMenuItem } from '../../../services/hierarchical-menu.service';
import { HierarchicalMenuComponent } from '../../shared/hierarchical-menu.component';
import { AdminapiService } from '../../../../admin/services/adminapi.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-configuration-sidebar',
  standalone: true,
  imports: [CommonModule, HierarchicalMenuComponent],
  templateUrl: './admin-configuration-sidebar.component.html',
  styleUrls: ['./admin-configuration-sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminConfigurationSidebarComponent implements OnInit, OnDestroy {
  @Input() isSidebarOpen = true;
  hierarchicalMenu: HierarchicalMenuItem[] = [];
  loading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();
  private menuLoaded = false;

  constructor(
    private router: Router,
    private hierarchicalMenuService: HierarchicalMenuService,
    private adminapiService: AdminapiService
  ) {}

  ngOnInit(): void {
    if (!this.menuLoaded) {
      this.loadHierarchicalMenu();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadHierarchicalMenu(): void {
    if (this.menuLoaded || this.loading) {
      return; // Prevent multiple simultaneous calls
    }
    
    this.loading = true;
    this.error = null;

    this.hierarchicalMenuService.getHierarchicalMenu()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menu) => {
          console.log('Hierarchical menu loaded:', menu);
          this.hierarchicalMenu = menu;
          this.loading = false;
          this.menuLoaded = true;
        },
        error: (error) => {
          console.error('Error loading hierarchical menu:', error);
          this.error = 'Failed to load menu structure';
          this.loading = false;
          this.menuLoaded = true;
          
          // Load sample data as fallback
          this.loadSampleMenuData();
        }
      });
  }

  private loadSampleMenuData(): void {
    if (this.hierarchicalMenu.length > 0) {
      return; // Don't overwrite existing data
    }
    
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

  onMenuClick(item: HierarchicalMenuItem): void {
    // Prevent multiple rapid clicks
    if (this.loading) {
      return;
    }
    
    console.log('Menu item clicked:', item);
    
    if (item.routerUrl) {
      // Navigate based on the component type
      if (item.isMaster) {
        // Navigate to master data view
        this.adminapiService.setComponentId(item.id);
        this.router.navigate(['/adminconfiguration/masterdata', item.id]);
      } else {
        // Navigate to base data view
        this.adminapiService.setComponentId(item.id);
        this.router.navigate(['/adminconfiguration/basedata', item.id]);
      }
    } else {
      console.warn('No router URL defined for item:', item);
    }
  }

  navigateToBaseConfiguration(): void {
    this.router.navigate(['/adminconfiguration/baseconfiguration']);
  }

  navigateToMasterConfiguration(): void {
    this.router.navigate(['/adminconfiguration/masterconfiguration']);
  }
}
