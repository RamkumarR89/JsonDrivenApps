import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface MenuItem {
  id: number;
  componentName: string;
  parentComponent: string;
  displayName: string;
  isActive: boolean;
  isDeleted: boolean;
  componentJson?: string;
  customAttributeJson?: string;
  isMaster: boolean;
  children?: MenuItem[];
}

export interface HierarchicalMenuItem {
  id: string;
  name: string;
  parentComponent: string;
  componentJson?: string;
  isMaster: boolean;
  children?: HierarchicalMenuItem[];
  icon?: string;
  routerUrl?: string;
  routerParams?: string[];
  isExpanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HierarchicalMenuService {
  private readonly baseUrl = 'http://localhost:5135/api';

  constructor(private http: HttpClient) {}

  // Get all components from the backend
  getMenuComponents(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.baseUrl}/Basecomponent`);
  }

  // Build hierarchical tree structure from flat component list
  buildMenuTree(components: MenuItem[]): HierarchicalMenuItem[] {
    // Create a map for quick lookup
    const componentMap = new Map<number, HierarchicalMenuItem>();
    const roots: HierarchicalMenuItem[] = [];

    // First pass: convert all components to menu items
    components.forEach(component => {
      const menuItem: HierarchicalMenuItem = {
        id: component.id.toString(),
        name: component.displayName,
        parentComponent: component.parentComponent,
        componentJson: component.componentJson,
        isMaster: component.isMaster,
        children: [],
        ...this.parseComponentJson(component.componentJson)
      };
      
      componentMap.set(component.id, menuItem);
    });

    // Second pass: build the tree structure
    components.forEach(component => {
      const menuItem = componentMap.get(component.id)!;
      const parentId = parseInt(component.parentComponent);

      if (parentId === 0) {
        // Root level item
        roots.push(menuItem);
      } else {
        // Child item - find parent and add to children
        const parent = componentMap.get(parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(menuItem);
        } else {
          console.warn(`Parent with ID ${parentId} not found for component ${component.id}`);
          // If parent not found, treat as root
          roots.push(menuItem);
        }
      }
    });

    // Sort children alphabetically for better UX
    this.sortMenuItems(roots);
    
    return roots;
  }

  // Parse component JSON to extract icon, router URL, and parameters
  private parseComponentJson(componentJson?: string): { icon?: string; routerUrl?: string; routerParams?: string[] } {
    if (!componentJson) {
      return {};
    }
    // Only parse if it looks like JSON
    const trimmed = componentJson.trim();
    if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) {
      // Not valid JSON, skip parsing
      return {};
    }
    try {
      const json = JSON.parse(componentJson);
      return {
        icon: json.menuicon || 'far fa-file-alt me-2',
        routerUrl: json.routerurl || '/',
        routerParams: json.routerparam ? json.routerparam.split(',').filter((p: string) => p.trim()) : []
      };
    } catch (error) {
      console.error('Error parsing component JSON:', error);
      return {};
    }
  }

  // Sort menu items alphabetically
  private sortMenuItems(items: HierarchicalMenuItem[]): void {
    items.sort((a, b) => a.name.localeCompare(b.name));
    
    // Recursively sort children
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        this.sortMenuItems(item.children);
      }
    });
  }

  // Get hierarchical menu data ready for display
  getHierarchicalMenu(): Observable<HierarchicalMenuItem[]> {
    return this.getMenuComponents().pipe(
      map(components => this.buildMenuTree(components))
    );
  }
}
