  import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface BaseComponent {
  id: number;
  componentName: string;
  parentComponent: string;
  displayName: string;
  isActive: boolean; // Changed from 'active' to 'isActive' to match backend
  componentJson?: string; // JSON configuration for the component
}

export interface CreateBaseComponentRequest {
  componentName: string;
  parentComponent?: string;
  displayName: string;
  isActive: boolean; // Changed from 'active' to 'isActive' to match backend
  componentJson?: string; // JSON configuration for the component
}

@Injectable({
  providedIn: 'root'
})
export class BaseComponentService {
  private readonly baseUrl = 'http://localhost:5135/api';
  private componentsSubject = new BehaviorSubject<BaseComponent[]>([]);
  public components$ = this.componentsSubject.asObservable();
  private cachedComponents: BaseComponent[] = [];
  private lastFetchTime = 0;
  private cacheTimeout = 30000; // 30 seconds cache

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(private http: HttpClient) {
    console.log('BaseComponentService initialized with baseUrl:', this.baseUrl);
  }

  // Get paged base components for server-side rendering
  getPagedBaseComponents(page: number, pageSize: number): Observable<{data: BaseComponent[], total: number}> {
    return this.http.get<{data: BaseComponent[], total: number}>(`${this.baseUrl}/Basecomponent/paged?page=${page}&pageSize=${pageSize}`, this.httpOptions)
      .pipe(
        catchError(this.handleError<{data: BaseComponent[], total: number}>('getPagedBaseComponents', {data: [], total: 0}))
      );
  }

  // Get all base components with intelligent caching for faster loading
  getBaseComponents(): Observable<BaseComponent[]> {
    console.log('Fetching components from:', `${this.baseUrl}/Basecomponent`);
    
    // Check if we have fresh cached data
    const now = Date.now();
    if (this.cachedComponents.length > 0 && (now - this.lastFetchTime) < this.cacheTimeout) {
      console.log('Returning cached components for faster loading:', this.cachedComponents.length);
      return new Observable(observer => {
        observer.next(this.cachedComponents);
        observer.complete();
      });
    }
    
    // Fetch fresh data from API
    return this.http.get<BaseComponent[]>(`${this.baseUrl}/Basecomponent`, this.httpOptions)
      .pipe(
        tap(components => {
          // Cache the fresh data for future fast access
          this.cachedComponents = components;
          this.lastFetchTime = now;
          console.log('Components fetched and cached for faster future loading:', components.length);
        }),
        catchError(this.handleError<BaseComponent[]>('getBaseComponents', []))
      );
  }

  // Get base component by ID
  getBaseComponent(id: number): Observable<BaseComponent> {
    return this.http.get<BaseComponent>(`${this.baseUrl}/Basecomponent/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError<BaseComponent>('getBaseComponent'))
      );
  }

  // Create new base component
  createBaseComponent(component: CreateBaseComponentRequest): Observable<BaseComponent> {
    return this.http.post<BaseComponent>(`${this.baseUrl}/Basecomponent`, component, this.httpOptions)
      .pipe(
        catchError(this.handleError<BaseComponent>('createBaseComponent'))
      );
  }

  // Update base component
  updateBaseComponent(id: number, component: BaseComponent): Observable<BaseComponent> {
    return this.http.put<BaseComponent>(`${this.baseUrl}/Basecomponent/${id}`, component, this.httpOptions)
      .pipe(
        catchError(this.handleError<BaseComponent>('updateBaseComponent'))
      );
  }

  // Delete base component
  deleteBaseComponent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Basecomponent/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('deleteBaseComponent'))
      );
  }

  // Refresh components list
  refreshComponents(): void {
    console.log('Refreshing components list...');
    this.getBaseComponents().subscribe({
      next: (components) => {
        console.log('Components refreshed, updating observable with', components.length, 'items');
        this.componentsSubject.next(components);
      },
      error: (error) => {
        console.error('Error refreshing components:', error);
      }
    });
  }

  // Update components subject directly (for internal use)
  updateComponentsSubject(components: BaseComponent[]): void {
    this.componentsSubject.next(components);
  }

  // Clear cache to force fresh data fetch
  clearCache(): void {
    this.cachedComponents = [];
    this.lastFetchTime = 0;
    console.log('Cache cleared - next fetch will be fresh from API');
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Detailed error logging for CORS issues
      if (error.status === 0) {
        console.error('CORS Error or Network Failure. Check if backend is running on http://localhost:5135');
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          url: error.url
        });
      }
      
      // Let the app keep running by returning an empty result
      return new Observable<T>(observer => {
        if (result !== undefined) {
          observer.next(result as T);
        }
        observer.error(error);
        observer.complete();
      });
    };
  }
}
