import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BaseDefinition, BaseDefinitionDto } from '../models/base-definition.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseDefinitionService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/baseDefinition`;
  
  // Store component ID for definitions
  private currentComponentId = new BehaviorSubject<number | null>(null);
  public componentId$ = this.currentComponentId.asObservable();

  // Store definitions list
  private definitionsSubject = new BehaviorSubject<BaseDefinition[]>([]);
  public definitions$ = this.definitionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Set the current component ID for filtering definitions
  setComponentId(componentId: number): void {
    this.currentComponentId.next(componentId);
  }

  // Get the current component ID
  getComponentId(): number | null {
    return this.currentComponentId.getValue();
  }

  // Get all base definitions
  getBaseDefinitions(): Observable<BaseDefinition[]> {
    return this.http.get<BaseDefinition[]>(this.apiUrl).pipe(
      map(definitions => this.processApiResponse(definitions)),
      tap(definitions => this.definitionsSubject.next(definitions)),
      catchError(this.handleError<BaseDefinition[]>('getBaseDefinitions', []))
    );
  }

  // Get base definitions by component ID
  getDefinitionsByComponentId(componentId: number): Observable<BaseDefinition[]> {
    const url = `${this.apiUrl}/componentList/${componentId}`;
    return this.http.get<BaseDefinition[]>(url).pipe(
      map(definitions => this.processApiResponse(definitions)),
      tap(definitions => this.definitionsSubject.next(definitions)),
      catchError(this.handleError<BaseDefinition[]>(`getDefinitionsByComponentId id=${componentId}`, []))
    );
  }

  // Get a single base definition by ID
  getDefinitionById(id: number): Observable<BaseDefinition> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<BaseDefinition>(url).pipe(
      map(definition => this.processApiResponseSingle(definition)),
      catchError(this.handleError<BaseDefinition>(`getDefinitionById id=${id}`))
    );
  }

  // Create a new base definition
  createBaseDefinition(definition: BaseDefinitionDto): Observable<BaseDefinition> {
    return this.http.post<BaseDefinition>(this.apiUrl, definition).pipe(
      map(definition => this.processApiResponseSingle(definition)),
      tap(newDefinition => {
        const currentDefinitions = this.definitionsSubject.getValue();
        this.definitionsSubject.next([...currentDefinitions, newDefinition]);
      }),
      catchError(this.handleError<BaseDefinition>('createBaseDefinition'))
    );
  }

  // Update an existing base definition
  updateBaseDefinition(definition: BaseDefinitionDto): Observable<BaseDefinition> {
    const url = `${this.apiUrl}/${definition.id}`;
    return this.http.put<BaseDefinition>(url, definition).pipe(
      map(definition => this.processApiResponseSingle(definition)),
      tap(updatedDefinition => {
        const currentDefinitions = this.definitionsSubject.getValue();
        const index = currentDefinitions.findIndex(d => d.id === updatedDefinition.id);
        if (index >= 0) {
          const updatedDefinitions = [...currentDefinitions];
          updatedDefinitions[index] = updatedDefinition;
          this.definitionsSubject.next(updatedDefinitions);
        }
      }),
      catchError(this.handleError<BaseDefinition>(`updateBaseDefinition id=${definition.id}`))
    );
  }

  // Delete a base definition
  deleteBaseDefinition(id: number): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<boolean>(url).pipe(
      tap(_ => {
        const currentDefinitions = this.definitionsSubject.getValue();
        this.definitionsSubject.next(currentDefinitions.filter(d => d.id !== id));
      }),
      catchError(this.handleError<boolean>(`deleteBaseDefinition id=${id}`))
    );
  }

  // Refresh definitions (useful after mutations)
  refreshDefinitions(): void {
    const componentId = this.currentComponentId.getValue();
    if (componentId) {
      this.getDefinitionsByComponentId(componentId).subscribe();
    } else {
      this.getBaseDefinitions().subscribe();
    }
  }

  // Process API response to handle IDs and JSON parsing
  private processApiResponse(response: any): BaseDefinition[] {
    if (!response) return [];
    
    // Handle Firebase-style response object
    if (typeof response === 'object' && !Array.isArray(response)) {
      return Object.entries(response).map(([key, value]: [string, any]) => {
        // Ensure id is set properly from Firebase key
        if (!value.id) {
          value.id = key;
        }
        
        // Parse JSON fields if they're stored as strings
        return this.parseJsonFields(value);
      });
    }
    
    // Handle array response
    return response.map((item: any) => this.parseJsonFields(item));
  }

  // Process a single definition response
  private processApiResponseSingle(definition: any): BaseDefinition {
    if (!definition) return {} as BaseDefinition;
    return this.parseJsonFields(definition);
  }

  // Parse JSON fields that might be stored as strings
  private parseJsonFields(definition: any): BaseDefinition {
    const parsedDefinition = { ...definition };
    
    // Parse JSON fields if they're strings
    ['ctrlGroupJson', 'ctrlInfoJson', 'ctrlPropertiesJson', 'ctrlSourceJson'].forEach(field => {
      if (typeof parsedDefinition[field] === 'string' && parsedDefinition[field]) {
        try {
          parsedDefinition[field] = JSON.parse(parsedDefinition[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });
    
    return parsedDefinition as BaseDefinition;
  }

  // Error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
