import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Theme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  preview?: string; // URL to preview image
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'app-theme';
  private currentThemeSubject!: BehaviorSubject<Theme>;
  public currentTheme$!: Observable<Theme>;

  private themes: Theme[] = [
    {
      id: 'default',
      name: 'default',
      displayName: 'Default Blue',
      description: 'Classic blue theme with modern gradients',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#f093fb',
        background: '#f8f9fa',
        surface: '#ffffff',
        text: '#2d3748',
        textSecondary: '#718096',
        border: '#e2e8f0',
        success: '#48bb78',
        warning: '#ed8936',
        danger: '#f56565',
        info: '#4299e1'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      shadows: {
        small: '0 2px 4px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
        large: '0 8px 15px rgba(0, 0, 0, 0.15)'
      }
    },
    {
      id: 'ocean',
      name: 'ocean',
      displayName: 'Ocean Breeze',
      description: 'Calm ocean blues and aqua tones',
      colors: {
        primary: '#0ea5e9',
        secondary: '#06b6d4',
        accent: '#67e8f9',
        background: '#f0f9ff',
        surface: '#ffffff',
        text: '#0c4a6e',
        textSecondary: '#0369a1',
        border: '#bae6fd',
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
        info: '#0284c7'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        secondary: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 100%)',
        accent: 'linear-gradient(135deg, #a5f3fc 0%, #67e8f9 100%)'
      },
      shadows: {
        small: '0 2px 4px rgba(14, 165, 233, 0.1)',
        medium: '0 4px 6px rgba(14, 165, 233, 0.15)',
        large: '0 8px 15px rgba(14, 165, 233, 0.2)'
      }
    },
    {
      id: 'sunset',
      name: 'sunset',
      displayName: 'Sunset Glow',
      description: 'Warm sunset oranges and pinks',
      colors: {
        primary: '#f97316',
        secondary: '#ec4899',
        accent: '#fbbf24',
        background: '#fef7f0',
        surface: '#ffffff',
        text: '#9a3412',
        textSecondary: '#c2410c',
        border: '#fed7aa',
        success: '#65a30d',
        warning: '#ca8a04',
        danger: '#dc2626',
        info: '#0891b2'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
        secondary: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        accent: 'linear-gradient(135deg, #fb7185 0%, #f97316 100%)'
      },
      shadows: {
        small: '0 2px 4px rgba(249, 115, 22, 0.1)',
        medium: '0 4px 6px rgba(249, 115, 22, 0.15)',
        large: '0 8px 15px rgba(249, 115, 22, 0.2)'
      }
    },
    {
      id: 'forest',
      name: 'forest',
      displayName: 'Forest Green',
      description: 'Natural greens and earth tones',
      colors: {
        primary: '#059669',
        secondary: '#84cc16',
        accent: '#22c55e',
        background: '#f0fdf4',
        surface: '#ffffff',
        text: '#14532d',
        textSecondary: '#166534',
        border: '#bbf7d0',
        success: '#16a34a',
        warning: '#eab308',
        danger: '#dc2626',
        info: '#0284c7'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #059669 0%, #84cc16 100%)',
        secondary: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        accent: 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)'
      },
      shadows: {
        small: '0 2px 4px rgba(5, 150, 105, 0.1)',
        medium: '0 4px 6px rgba(5, 150, 105, 0.15)',
        large: '0 8px 15px rgba(5, 150, 105, 0.2)'
      }
    },
    {
      id: 'purple',
      name: 'purple',
      displayName: 'Royal Purple',
      description: 'Elegant purples and lavender',
      colors: {
        primary: '#8b5cf6',
        secondary: '#a855f7',
        accent: '#c084fc',
        background: '#faf5ff',
        surface: '#ffffff',
        text: '#581c87',
        textSecondary: '#7c3aed',
        border: '#e9d5ff',
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
        info: '#0284c7'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
        secondary: 'linear-gradient(135deg, #c084fc 0%, #ddd6fe 100%)',
        accent: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'
      },
      shadows: {
        small: '0 2px 4px rgba(139, 92, 246, 0.1)',
        medium: '0 4px 6px rgba(139, 92, 246, 0.15)',
        large: '0 8px 15px rgba(139, 92, 246, 0.2)'
      }
    },
    {
      id: 'dark',
      name: 'dark',
      displayName: 'Dark Mode',
      description: 'Modern dark theme with blue accents',
      colors: {
        primary: '#60a5fa',
        secondary: '#818cf8',
        accent: '#34d399',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        textSecondary: '#d1d5db',
        border: '#374151',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)',
        secondary: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
        accent: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
      },
      shadows: {
        small: '0 2px 4px rgba(0, 0, 0, 0.3)',
        medium: '0 4px 6px rgba(0, 0, 0, 0.4)',
        large: '0 8px 15px rgba(0, 0, 0, 0.5)'
      }
    }
  ];

  constructor() {
    // Initialize BehaviorSubject after themes array is defined
    this.currentThemeSubject = new BehaviorSubject<Theme>(this.getDefaultTheme());
    this.currentTheme$ = this.currentThemeSubject.asObservable();
    this.loadThemeFromStorage();
  }

  getThemes(): Theme[] {
    return [...this.themes];
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  setTheme(themeId: string): void {
    const theme = this.themes.find(t => t.id === themeId);
    if (theme) {
      this.currentThemeSubject.next(theme);
      this.saveThemeToStorage(theme);
      this.applyThemeToDocument(theme);
    }
  }

  private getDefaultTheme(): Theme {
    return this.themes && this.themes.length > 0 ? this.themes[0] : {
      id: 'default',
      name: 'default',
      displayName: 'Default Blue',
      description: 'Classic blue theme with modern gradients',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#f093fb',
        background: '#f8f9fa',
        surface: '#ffffff',
        text: '#2d3748',
        textSecondary: '#718096',
        border: '#e2e8f0',
        success: '#48bb78',
        warning: '#ed8936',
        danger: '#f56565',
        info: '#4299e1'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      shadows: {
        small: '0 2px 4px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
        large: '0 8px 15px rgba(0, 0, 0, 0.15)'
      }
    };
  }

  private loadThemeFromStorage(): void {
    const savedThemeId = localStorage.getItem(this.THEME_STORAGE_KEY);
    if (savedThemeId) {
      const theme = this.themes.find(t => t.id === savedThemeId);
      if (theme) {
        this.currentThemeSubject.next(theme);
        this.applyThemeToDocument(theme);
      }
    } else {
      this.applyThemeToDocument(this.getDefaultTheme());
    }
  }

  private saveThemeToStorage(theme: Theme): void {
    localStorage.setItem(this.THEME_STORAGE_KEY, theme.id);
  }

  private applyThemeToDocument(theme: Theme): void {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${this.kebabCase(key)}`, value);
    });

    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${this.kebabCase(key)}`, value);
    });

    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${this.kebabCase(key)}`, value);
    });

    // Set theme class on body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme.name}`);
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
