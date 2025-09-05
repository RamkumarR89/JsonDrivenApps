import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(public http: HttpClient) {}

  protected get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      map((body: T) => body),
      catchError((error: any) => {
        console.error(error);
        return of(error.message || 'Server Error');
      })
    );
  }

  protected post<T>(url: string, payload: any): Observable<T> {
    return this.http.post<T>(url, payload).pipe(
      map((body: T) => body),
      catchError((error: any) => {
        console.error(error);
        return of(error.message || 'Server Error');
      })
    );
  }

  protected put<T>(url: string, payload: any): Observable<T> {
    return this.http.put<T>(url, payload).pipe(
      map((body: T) => body),
      catchError((error: any) => {
        console.error(error);
        return of(error.message || 'Server Error');
      })
    );
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url).pipe(
      map((body: T) => body),
      catchError((error: any) => {
        console.error(error);
        return of(error.message || 'Server Error');
      })
    );
  }

  public list<T>(url: string): Observable<T[]> {
    return this.http.get<T[]>(url).pipe(
      map((body: T[]) => body),
      catchError((error: any) => {
        console.error('Error fetching data:', error);
        return of([]);
      })
    );
  }
}
