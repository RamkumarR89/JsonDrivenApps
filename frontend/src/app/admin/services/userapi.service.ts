import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserapiService {
  constructor(private http: HttpClient) { }

  letzurl: any = 'https://letz-c5846-default-rtdb.firebaseio.com';
  table: any = 'users';
  tableformat: any = '.json';
  newletzUserurl: any = 'https://sheetdb.io/api/v1/z3i3rca8awhnl';

  public getData(payload: any): Observable<any> {
    return this.http
      .get<any>(`${this.letzurl}/${this.table}/${payload}${this.tableformat}`, {})
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  public postData(payload: any): Observable<any> {
    const requestUrl = `${this.newletzUserurl}`;
    return this.http.post(requestUrl, payload).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load'))
    );
  }

  public putData(payload: any): Observable<any> {
    const requestUrl = `${this.letzurl}/${this.table}/${payload}${this.tableformat}`;
    return this.http.put(requestUrl, payload).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load'))
    );
  }

  public deleteData(payload: any): Observable<any> {
    const requestUrl = `${this.letzurl}/${this.table}/${payload}${this.tableformat}`;
    return this.http.delete(requestUrl).pipe(
      map((body: any) => body = true),
      catchError(() => of('Error, could not load'))
    );
  }

  public getbyData(payload: any): Observable<any> {
    const url = `${this.newletzUserurl}/search`;
    const params = { email: payload.email, password: payload.password };
    return this.http
      .get<any>(`${url}`, { params: params })
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }
}
