import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchicalMenuItem } from '../../services/hierarchical-menu.service';

@Component({
  selector: 'hierarchical-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="tree-menu">
      <ng-container *ngFor="let item of menuItems">
        <li class="tree-item" [class.has-children]="item.children && item.children.length > 0">
          <div class="tree-item-content" 
               [class.expanded]="item.isExpanded"
               [class.has-children]="item.children && item.children.length > 0"
               (click)="onItemClick(item)">
            
            <!-- Menu Item Icon -->
            <span class="menu-icon">
              <i [class]="item.icon || 'far fa-file-alt'"></i>
            </span>
            
            <!-- Menu Item Name -->
            <span class="menu-name">{{ item.name }}</span>
            
            <!-- Master Badge -->
            <span *ngIf="item.isMaster" class="master-badge">
              <i class="fas fa-crown"></i>
            </span>
            
            <!-- Expand/Collapse Icon for items with children - Now on the right -->
            <span *ngIf="item.children && item.children.length > 0" 
                  class="expand-icon"
                  (click)="toggleExpand($event, item)">
              <i [class]="getExpandIcon(item.isExpanded)"></i>
            </span>
          </div>
          
          <!-- Recursive children -->
          <div *ngIf="item.children && item.children.length > 0" 
               class="tree-children"
               [class.expanded]="item.isExpanded">
            <hierarchical-menu 
              [menuItems]="item.children" 
              (menuItemClick)="menuItemClick.emit($event)">
            </hierarchical-menu>
          </div>
        </li>
      </ng-container>
    </ul>
  `,
  styles: [`
    .tree-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .tree-item {
      margin: 0;
      padding: 0;
    }
    
    .tree-item-content {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      cursor: pointer;
      border-radius: 6px;
      margin: 2px 8px;
      transition: all 0.3s ease;
      position: relative;
      color: #475569;
      font-weight: 500;
      font-size: 13px;
    }
    
    .tree-item-content:hover {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      color: #1e293b;
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .tree-item-content.expanded {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      color: #1d4ed8;
      font-weight: 600;
      border-left: 3px solid #3b82f6;
    }
    
    .tree-item-content.has-children {
      font-weight: 600;
    }
    
    .tree-item-content.has-children:hover {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      color: #0369a1;
    }
    
    .expand-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: auto;
      color: #64748b;
      transition: all 0.3s ease;
      border-radius: 4px;
      background: transparent;
    }
    
    .expand-icon:hover {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      transform: scale(1.1);
    }
    
    .tree-item-content:hover .expand-icon {
      color: #3b82f6;
    }
    
    .tree-item-content.expanded .expand-icon {
      color: #1d4ed8;
    }
    
    .menu-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: #64748b;
      transition: all 0.3s ease;
    }
    
    .tree-item-content:hover .menu-icon {
      color: #3b82f6;
      transform: scale(1.1);
    }
    
    .tree-item-content.expanded .menu-icon {
      color: #1d4ed8;
    }
    
    .menu-name {
      flex: 1;
      font-size: 13px;
      transition: all 0.3s ease;
    }
    
    .master-badge {
      margin-left: 8px;
      color: #f59e0b;
      font-size: 12px;
      transition: all 0.3s ease;
    }
    
    .tree-item-content:hover .master-badge {
      color: #d97706;
      transform: scale(1.1);
    }
    
    .tree-children {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      padding-left: 24px;
      border-left: 1px solid #e2e8f0;
      margin-left: 16px;
    }
    
    .tree-children.expanded {
      max-height: 1000px;
      animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Animation for expand/collapse */
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .tree-children:not(.expanded) {
      max-height: 0;
    }
    
    .tree-children.expanded {
      max-height: none;
    }
    
    /* Enhanced hover effects for nested items */
    .tree-children .tree-item-content {
      margin: 1px 4px;
      padding: 8px 12px;
    }
    
    .tree-children .tree-item-content:hover {
      transform: translateX(2px);
    }
  `]
})
export class HierarchicalMenuComponent {
  @Input() menuItems: HierarchicalMenuItem[] = [];
  @Output() menuItemClick = new EventEmitter<HierarchicalMenuItem>();

  private clickingItems = new Map<string, boolean>();

  onItemClick(item: HierarchicalMenuItem) {
    const itemKey = item.id?.toString() || item.name || 'unknown';

    // Debounce rapid clicks
    if (this.clickingItems.get(itemKey)) {
      return;
    }

    this.clickingItems.set(itemKey, true);
    setTimeout(() => {
      this.clickingItems.delete(itemKey);
    }, 300);

    // Only emit if it's a leaf node (no children) or if it's a master item
    if (!item.children || item.children.length === 0 || item.isMaster) {
      this.menuItemClick.emit(item);
    }
  }

  toggleExpand(event: Event, item: HierarchicalMenuItem) {
    event.stopPropagation(); // Prevent triggering onItemClick
    item.isExpanded = !item.isExpanded;
  }

  getExpandIcon(isExpanded: boolean | undefined): string {
    if (isExpanded) {
      return 'fas fa-chevron-up'; // Up arrow when expanded
    } else {
      return 'fas fa-chevron-down'; // Down arrow when collapsed
    }
  }
}
