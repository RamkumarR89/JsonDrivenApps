import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class MasterBaseConfigurationapiService extends BaseService {
  private readonly endpoint = '/api/masterbasecomponent';
  private readonly baseUrl = 'http://localhost:8000'; // Update to your backend URL

  constructor(public override http: HttpClient) {
    super(http);
  }

  public listData(): Observable<any> {
    const url = `${this.baseUrl}${this.endpoint}`;
    return this.list<any>(url);
  }

  public getData(payload: any): Observable<any> {
    const url = `${this.baseUrl}${this.endpoint}/${payload}`;
    return this.get<any>(url).pipe(
      map((body: any) => {
        const id = payload;
        body.id = id;
        return { ...body, payload };
      })
    );
  }

  public postData(payload: any): Observable<any> {
    const url = `${this.baseUrl}${this.endpoint}`;
    return this.post<any>(url, payload);
  }

  public putData(payload: any): Observable<any> {
    const url = `${this.baseUrl}${this.endpoint}/${payload.id}`;
    return this.put<any>(url, payload);
  }

  public deleteData(payload: any): Observable<any> {
    const url = `${this.baseUrl}${this.endpoint}/${payload}`;
    return this.delete<any>(url);
  }

  public getpcomplistData(): Observable<any[]> {
    const url = `${this.baseUrl}${this.endpoint}`;
    return this.get<any[]>(url);
  }

  private compoentDataSubject = new BehaviorSubject<any>(null);
  compoentData$: Observable<any> = this.compoentDataSubject.asObservable();

  setcompoentData(data: any) {
    this.compoentDataSubject.next(data);
  }

  getcompoentData(): any {
    return this.compoentDataSubject.value;
  }
}
