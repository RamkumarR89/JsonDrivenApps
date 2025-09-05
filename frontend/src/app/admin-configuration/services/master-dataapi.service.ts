import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class MasterDataapiService extends BaseService {
  private readonly baseUrl = 'http://localhost:8000'; // Update to your backend URL
  private readonly basedatatable = 'api/masterData';

  constructor(http: HttpClient) {
    super(http);
  }

  private constructUrl(id?: string): string {
    return id ? `${this.baseUrl}/${this.basedatatable}/${id}` : `${this.baseUrl}/${this.basedatatable}`;
  }

  public getpcompbyid(id: string): Observable<any> {
    const url = this.constructUrl(`${this.baseUrl}/${this.basedatatable}/Component${id}`);
    return this.get<any>(url);
  }

  public listDataBycompId(compId: any): Observable<any> {
    const url = this.constructUrl(`${this.baseUrl}/${this.basedatatable}/componentList${compId}`);
    return this.list<any>(url);
  }

  public getData(id: string): Observable<any> {
    const url = this.constructUrl(id);
    return this.get<any>(url);
  }

  public postData(payload: any): Observable<any> {
    const url = this.constructUrl();
    return this.post<any>(url, payload);
  }

  public putData(payload: any): Observable<any> {
    const url = this.constructUrl(payload.id);
    return this.put<any>(url, payload);
  }

  public deleteData(id: string): Observable<any> {
    const url = this.constructUrl(id);
    return this.delete<any>(url);
  }

  public listData(): Observable<any[]> {
    const url = this.constructUrl();
    return this.list<any>(url);
  }
}
