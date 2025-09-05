import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../services/theme.service';
import { ThemeSelectorComponent } from './theme-selector.component';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, ThemeSelectorComponent],
  template: `
    <div class="theme-toggle-container">
      <!-- Theme Toggle Button -->
      <button 
        class="theme-toggle-btn"
        (click)="toggleThemeSelector()"
        [attr.title]="'Current theme: ' + currentTheme.displayName">
        <i class="fa fa-palette"></i>
        <span class="theme-name d-none d-md-inline">{{ currentTheme.displayName }}</span>
        <i class="fa fa-chevron-down ms-1"></i>
      </button>

      <!-- Theme Selector Modal -->
      <div 
        class="theme-selector-modal" 
        [class.show]="showThemeSelector"
        (click)="closeThemeSelector()"
        *ngIf="showThemeSelector">
        <div class="theme-selector-content" (click)="$event.stopPropagation()">
          <app-theme-selector (themeSelected)="closeThemeSelector()"></app-theme-selector>
        </div>
      </div>

      <!-- Quick Theme Switcher -->
      <div class="quick-themes" *ngIf="showQuickThemes">
        <div class="quick-theme-header">
          <span>Quick Themes</span>
          <button (click)="showAdvancedThemes()" class="btn-link">
            <i class="fa fa-cog"></i> More
          </button>
        </div>
        <div class="quick-theme-grid">
          <button 
            *ngFor="let theme of popularThemes" 
            class="quick-theme-btn"
            [class.active]="theme.id === currentTheme.id"
            (click)="selectTheme(theme)"
            [style.background]="theme.gradients.primary"
            [attr.title]="theme.displayName">
            <div class="theme-preview-mini">
              <div class="preview-line" [style.background-color]="theme.colors.surface"></div>
              <div class="preview-line short" [style.background-color]="theme.colors.accent"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .theme-toggle-container {
      position: relative;
      display: inline-block;
    }

    .theme-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      background: var(--color-surface);
      color: var(--color-text);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-small);
    }

    .theme-toggle-btn:hover {
      background: var(--color-background);
      transform: translateY(-1px);
      box-shadow: var(--shadow-medium);
    }

    .theme-name {
      font-weight: 500;
      font-size: 0.875rem;
    }

    .theme-selector-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      opacity: 0;
      visibility: hidden;
      transition: all var(--transition-normal);
    }

    .theme-selector-modal.show {
      opacity: 1;
      visibility: visible;
    }

    .theme-selector-content {
      transform: scale(0.9);
      transition: transform var(--transition-normal);
      max-height: 90vh;
      overflow-y: auto;
      margin: 1rem;
    }

    .theme-selector-modal.show .theme-selector-content {
      transform: scale(1);
    }

    .quick-themes {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-large);
      padding: 1rem;
      min-width: 200px;
      z-index: 1000;
      border: 1px solid var(--color-border);
    }

    .quick-theme-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-text);
    }

    .btn-link {
      background: none;
      border: none;
      color: var(--color-primary);
      cursor: pointer;
      font-size: 0.75rem;
      padding: 0;
    }

    .btn-link:hover {
      color: var(--color-secondary);
    }

    .quick-theme-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .quick-theme-btn {
      width: 40px;
      height: 40px;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-normal);
      position: relative;
      overflow: hidden;
      padding: 0.25rem;
    }

    .quick-theme-btn:hover {
      transform: scale(1.05);
      border-color: var(--color-primary);
    }

    .quick-theme-btn.active {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }

    .theme-preview-mini {
      display: flex;
      flex-direction: column;
      gap: 2px;
      height: 100%;
      justify-content: center;
    }

    .preview-line {
      height: 3px;
      border-radius: 2px;
      opacity: 0.8;
    }

    .preview-line.short {
      width: 70%;
      opacity: 0.6;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .theme-toggle-btn {
        padding: 0.5rem;
      }
      
      .theme-name {
        display: none;
      }
      
      .quick-themes {
        right: -50px;
        min-width: 180px;
      }
      
      .quick-theme-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Animation for modal */
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .theme-selector-modal.show .theme-selector-content {
      animation: modalFadeIn 0.3s ease-out;
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  currentTheme: Theme;
  showThemeSelector = false;
  showQuickThemes = false;
  popularThemes: Theme[] = [];

  constructor(private themeService: ThemeService) {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  ngOnInit() {
    // Subscribe to theme changes
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Get popular themes for quick switcher
    const allThemes = this.themeService.getThemes();
    this.popularThemes = allThemes.filter(theme => 
      ['default', 'ocean', 'sunset', 'forest', 'purple', 'dark'].includes(theme.id)
    );
  }

  toggleThemeSelector() {
    this.showThemeSelector = !this.showThemeSelector;
    this.showQuickThemes = false;
  }

  closeThemeSelector() {
    this.showThemeSelector = false;
    this.showQuickThemes = false;
  }

  selectTheme(theme: Theme) {
    this.themeService.setTheme(theme.id);
    this.closeThemeSelector();
  }

  showAdvancedThemes() {
    this.showQuickThemes = false;
    this.showThemeSelector = true;
  }
}
