import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseDefinitionApiService {
  private readonly endpoint = 'api/baseDefinition';
  private readonly baseUrl = 'http://localhost:5135'; // Using the same port as your backend

  constructor(private http: HttpClient) {}

  // Get list of all definitions
  public listData(): Observable<any[]> {
    const url = `${this.baseUrl}/${this.endpoint}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError<any[]>('listData', []))
    );
  }

  // Get list of definitions by component ID
  public listDataBycompId(compId: any): Observable<any[]> {
    if (!compId) {
      return of([]); // Return empty array if no compId
    }
    
    const url = `${this.baseUrl}/${this.endpoint}/componentList/${compId}`;
    return this.http.get<any[]>(url).pipe(
      map((res: any) => {
        // Process response similar to old frontend
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const element = res[key];
            if (!element.id) {
              element.id = key;
            }
          }
        }
        return res ? Object.values(res) : [];
      }),
      catchError(this.handleError<any[]>(`listDataBycompId id=${compId}`, []))
    );
  }

  // Get a specific definition by ID
  public getData(id: string): Observable<any> {
    const url = `${this.baseUrl}/${this.endpoint}/${id}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError<any>(`getData id=${id}`))
    );
  }

  // Create a new definition
  public postData(payload: any): Observable<any> {
    const url = `${this.baseUrl}/${this.endpoint}`;
    return this.http.post<any>(url, payload).pipe(
      catchError(this.handleError<any>('postData'))
    );
  }

  // Update a definition
  public putData(payload: any): Observable<any> {
    const url = `${this.baseUrl}/${this.endpoint}/${payload.id}`;
    return this.http.put<any>(url, payload).pipe(
      catchError(this.handleError<any>('putData'))
    );
  }

  // Delete a definition
  public deleteData(id: string): Observable<boolean> {
    const url = `${this.baseUrl}/${this.endpoint}/${id}`;
    return this.http.delete<boolean>(url).pipe(
      catchError(this.handleError<boolean>(`deleteData id=${id}`))
    );
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Return an empty result to keep the app running
      return of(result as T);
    };
  }
}
