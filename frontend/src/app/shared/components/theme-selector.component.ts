import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-selector">
      <div class="theme-header">
        <h5 class="theme-title">
          <i class="fa fa-palette me-2"></i>
          Choose Theme
        </h5>
        <p class="theme-description">Personalize your experience with beautiful themes</p>
      </div>

      <div class="theme-grid">
        <div 
          *ngFor="let theme of themes" 
          class="theme-card"
          [class.active]="theme.id === currentTheme.id"
          (click)="selectTheme(theme)"
          [attr.title]="theme.description">
          
          <!-- Theme Preview -->
          <div class="theme-preview" [style.background]="theme.gradients.primary">
            <div class="preview-header" [style.background-color]="theme.colors.surface">
              <div class="preview-dot" [style.background-color]="theme.colors.primary"></div>
              <div class="preview-dot" [style.background-color]="theme.colors.secondary"></div>
              <div class="preview-dot" [style.background-color]="theme.colors.accent"></div>
            </div>
            <div class="preview-content">
              <div class="preview-card" [style.background-color]="theme.colors.surface">
                <div class="preview-line primary" [style.background-color]="theme.colors.primary"></div>
                <div class="preview-line secondary" [style.background-color]="theme.colors.textSecondary"></div>
                <div class="preview-line accent" [style.background-color]="theme.colors.accent"></div>
              </div>
            </div>
          </div>

          <!-- Theme Info -->
          <div class="theme-info">
            <h6 class="theme-name">{{ theme.displayName }}</h6>
            <p class="theme-desc">{{ theme.description }}</p>
          </div>

          <!-- Selection Indicator -->
          <div class="selection-indicator" *ngIf="theme.id === currentTheme.id">
            <i class="fa fa-check"></i>
          </div>
        </div>
      </div>

      <div class="theme-actions">
        <button 
          type="button" 
          class="btn btn-primary btn-sm"
          (click)="closeSelector()">
          <i class="fa fa-check me-2"></i>
          Apply Theme
        </button>
        <button 
          type="button" 
          class="btn btn-outline-secondary btn-sm"
          (click)="resetToDefault()">
          <i class="fa fa-refresh me-2"></i>
          Reset to Default
        </button>
      </div>
    </div>
  `,
  styles: [`
    .theme-selector {
      background: var(--color-surface, #ffffff);
      border-radius: 12px;
      padding: 24px;
      box-shadow: var(--shadow-large, 0 8px 15px rgba(0, 0, 0, 0.15));
      max-width: 600px;
      width: 100%;
    }

    .theme-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .theme-title {
      color: var(--color-text, #2d3748);
      margin: 0 0 8px 0;
      font-weight: 600;
    }

    .theme-description {
      color: var(--color-text-secondary, #718096);
      margin: 0;
      font-size: 0.9rem;
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .theme-card {
      position: relative;
      border: 2px solid var(--color-border, #e2e8f0);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--color-surface, #ffffff);
    }

    .theme-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
    }

    .theme-card.active {
      border-color: var(--color-primary, #667eea);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .theme-preview {
      height: 80px;
      position: relative;
      padding: 8px;
      display: flex;
      flex-direction: column;
    }

    .preview-header {
      display: flex;
      gap: 4px;
      margin-bottom: 8px;
      padding: 4px 6px;
      border-radius: 6px;
      align-items: center;
    }

    .preview-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .preview-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preview-card {
      width: 80%;
      padding: 6px;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .preview-line {
      height: 3px;
      border-radius: 2px;
      margin: 2px 0;
    }

    .preview-line.primary {
      width: 100%;
    }

    .preview-line.secondary {
      width: 70%;
    }

    .preview-line.accent {
      width: 50%;
    }

    .theme-info {
      padding: 12px;
      text-align: center;
    }

    .theme-name {
      color: var(--color-text, #2d3748);
      margin: 0 0 4px 0;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .theme-desc {
      color: var(--color-text-secondary, #718096);
      margin: 0;
      font-size: 0.75rem;
      line-height: 1.2;
    }

    .selection-indicator {
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--color-primary, #667eea);
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
    }

    .theme-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      padding-top: 16px;
      border-top: 1px solid var(--color-border, #e2e8f0);
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
    }

    .btn-primary {
      background: var(--gradient-primary, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
    }

    .btn-outline-secondary {
      background: transparent;
      border: 1px solid var(--color-border, #e2e8f0);
      color: var(--color-text-secondary, #718096);
    }

    .btn-outline-secondary:hover {
      background: var(--color-background, #f8f9fa);
    }

    .fa {
      font-size: 0.875rem;
    }

    @media (max-width: 576px) {
      .theme-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .theme-selector {
        padding: 16px;
      }
      
      .theme-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ThemeSelectorComponent implements OnInit {
  @Output() themeSelected = new EventEmitter<void>();
  
  themes: Theme[] = [];
  currentTheme: Theme;

  constructor(private themeService: ThemeService) {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  ngOnInit() {
    this.themes = this.themeService.getThemes();
    
    // Subscribe to theme changes
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  selectTheme(theme: Theme) {
    this.themeService.setTheme(theme.id);
  }

  resetToDefault() {
    this.themeService.setTheme('default');
  }

  closeSelector() {
    this.themeSelected.emit();
  }
}
