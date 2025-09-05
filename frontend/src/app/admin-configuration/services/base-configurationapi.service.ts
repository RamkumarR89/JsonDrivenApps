import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BaseConfigurationapiService {
  constructor(private http: HttpClient) {}

  getpcomplistData(): Observable<any[]> {
    // Replace with your actual API endpoint if different
    return this.http.get<any[]>('http://localhost:5135/api/basecomponent');
  }
}
