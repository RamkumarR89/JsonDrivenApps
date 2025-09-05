import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AdminConfigurationSidebarComponent } from '../sidebar/admin-configuration-sidebar.component';

@Component({
  selector: 'app-admin-configuration-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, AdminConfigurationSidebarComponent],
  template: `
    <div class="admin-layout">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <button class="sidebar-toggle" (click)="toggleSidebar()">
            <i class="fas fa-bars"></i>
          </button>
          <h1>Admin Configuration</h1>
          <div class="header-actions">
            <div class="user-menu" [ngClass]="{'open': isUserMenuOpen}">
              <button class="user-btn" (click)="toggleUserMenu()">
                <i class="fas fa-user"></i>
                <i class="fas fa-chevron-down arrow" [ngClass]="{'rotated': isUserMenuOpen}"></i>
              </button>
              <div class="user-dropdown" [ngClass]="{'show': isUserMenuOpen}">
                <div class="user-info">
                  <div class="user-avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="user-details">
                    <div class="user-name">Admin User</div>
                    <div class="user-email">admin@confighub.com</div>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item" (click)="viewProfile($event)">
                  <i class="fas fa-user-circle"></i>
                  <span>My Profile</span>
                </a>
                <a href="#" class="dropdown-item" (click)="viewSettings($event)">
                  <i class="fas fa-cog"></i>
                  <span>Settings</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item logout" (click)="logout($event)">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="layout-body">
  <!-- Sidebar -->
  <app-admin-configuration-sidebar [isSidebarOpen]="isSidebarOpen" [ngClass]="{'open': isSidebarOpen, 'closed': !isSidebarOpen}"></app-admin-configuration-sidebar>

        <!-- Main Content -->
        <main class="main-content" [ngClass]="{'sidebar-open': isSidebarOpen, 'sidebar-closed': !isSidebarOpen}">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="row">
            <div class="col-12 col-sm-6 text-center text-sm-start">
              &copy; <a href="#" class="footer-link">Letz Buzz</a>, All Rights Reserved.
            </div>
            <div class="col-12 col-sm-6 text-center text-sm-end">
              <small class="text-muted">Admin Configuration Panel</small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .admin-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f8fafc;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      height: 60px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
  z-index: 1100;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .header-content {
      display: flex;
      align-items: center;
      padding: 0 1rem;
      height: 100%;
    }

    .sidebar-toggle {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      font-size: 1.1rem;
      margin-right: 1rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .sidebar-toggle:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-1px);
    }

    .header h1 {
      margin: 0;
      font-size: 1.5rem;
      flex: 1;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
      position: relative;
    }

    .user-menu {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .user-btn:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-1px);
    }

    .arrow {
      font-size: 0.7rem;
      transition: transform 0.3s ease;
    }

    .arrow.rotated {
      transform: rotate(180deg);
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-width: 250px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      z-index: 1001;
    }

    .user-dropdown.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .user-info {
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px 8px 0 0;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.2rem;
    }

    .user-email {
      font-size: 0.8rem;
      opacity: 0.9;
    }

    .dropdown-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 0.5rem 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #374151;
      text-decoration: none;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }

    .dropdown-item:hover {
      background: #f3f4f6;
      color: #667eea;
    }

    .dropdown-item.logout {
      color: #dc2626;
    }

    .dropdown-item.logout:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .dropdown-item i {
      width: 1.2rem;
      text-align: center;
    }

    .layout-body {
      display: flex;
      margin-top: 60px;
      flex: 1;
    }

    .sidebar {
      width: 250px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: fixed;
      top: 60px;
      left: 0;
      bottom: 50px;
      overflow-y: auto;
      transition: transform 0.3s ease;
      z-index: 999;
      box-shadow: 4px 0 12px rgba(102, 126, 234, 0.3);
    }

    .sidebar.closed {
      transform: translateX(-100%);
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .sidebar-header {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      background: rgba(255,255,255,0.1);
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .brand-icon {
      margin-right: 0.75rem;
      font-size: 1.3rem;
      color: #ffffff;
    }

    .sidebar-nav {
      padding: 1rem 0;
    }

    .nav-section {
      margin-bottom: 1.5rem;
    }

    .nav-section-title {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: rgba(255,255,255,0.8);
      font-weight: 600;
      letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      margin-bottom: 0.5rem;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #ecf0f1;
      text-decoration: none;
      transition: all 0.3s ease;
      margin: 0 0.5rem;
      border-radius: 6px;
    }

    .menu-item:hover {
      background: rgba(255,255,255,0.2);
      color: white;
      transform: translateX(5px);
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
    }

    .menu-item.active {
      background: rgba(255,255,255,0.25);
      color: white;
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }

    .menu-icon {
      margin-right: 0.75rem;
      width: 1.2rem;
      text-align: center;
      font-size: 1rem;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      margin-left: 0;
      transition: margin-left 0.3s ease;
      margin-bottom: 50px;
      background: #f8fafc;
      min-height: calc(100vh - 110px);
    }

    .main-content.sidebar-open {
  margin-left: 280px;
    }

    .main-content.sidebar-closed {
      margin-left: 0;
    }

    .footer {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      height: 50px;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      box-shadow: 0 -4px 12px rgba(102, 126, 234, 0.3);
    }

    .footer-content {
      width: 100%;
      padding: 0 1rem;
    }

    .footer-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
    }

    .footer-link:hover {
      text-decoration: underline;
      color: #ecf0f1;
    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .col-12 {
      flex: 1;
    }

    .text-center {
      text-align: center;
    }

    .text-sm-start {
      text-align: left;
    }

    .text-sm-end {
      text-align: right;
    }

    .text-muted {
      opacity: 0.8;
    }

    /* Scrollbar styling for sidebar */
    .sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.1);
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.4);
      border-radius: 3px;
    }

    .sidebar::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.6);
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .main-content {
        margin-left: 0 !important;
      }

      .text-sm-start,
      .text-sm-end {
        text-align: center;
      }

      .header h1 {
        font-size: 1.2rem;
      }
    }
  `]
})
export class AdminConfigurationLayoutComponent {
  isSidebarOpen = false;
  isUserMenuOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeUserMenu(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.isUserMenuOpen = false;
    }
  }

  viewProfile(event: Event) {
    event.preventDefault();
    this.isUserMenuOpen = false;
    // TODO: Navigate to profile page
    console.log('Navigate to profile');
  }

  viewSettings(event: Event) {
    event.preventDefault();
    this.isUserMenuOpen = false;
    // TODO: Navigate to settings page
    console.log('Navigate to settings');
  }

  logout(event: Event) {
    event.preventDefault();
    this.isUserMenuOpen = false;
    // TODO: Implement logout functionality
    if (confirm('Are you sure you want to logout?')) {
      console.log('Logging out...');
      // Clear session/localStorage if needed
      // Redirect to login page
      window.location.href = '/';
    }
  }
}
