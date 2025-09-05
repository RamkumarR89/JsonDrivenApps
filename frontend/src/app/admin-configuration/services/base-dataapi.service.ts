import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseDataapiService {
  private readonly baseUrl = 'http://localhost:5135';
  private readonly basedatatable = 'api/BaseData';

  constructor(private http: HttpClient) {}

  public getData(compid: string): Observable<any> {
    const url = `${this.baseUrl}/${this.basedatatable}/BaseData/${compid}`;
    return this.http.get<any>(url);
  }

  public postData(payload: any): Observable<any> {
    const url = `${this.baseUrl}/${this.basedatatable}`;
    return this.http.post<any>(url, payload);
  }

  public putData(payload: any): Observable<any> {
    const url = `${this.baseUrl}/${this.basedatatable}/${payload.id}`;
    return this.http.put<any>(url, payload);
  }
}


