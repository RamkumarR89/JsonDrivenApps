import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminapiService {
  private isSidebarOpenSubject = new BehaviorSubject<boolean>(false); // Start with sidebar HIDDEN
  private componentId: string | null = null;
  private jsonData: string = '';
  isSidebarOpen$: Observable<boolean> = this.isSidebarOpenSubject.asObservable();

  toggleSidebar() {
    this.isSidebarOpenSubject.next(!this.isSidebarOpenSubject.value);
  }

  private userDataSubject = new BehaviorSubject<User | any>(null);
  userData$: Observable<User | any> = this.userDataSubject.asObservable();

  setLoginData(data: User) {
    this.userDataSubject.next(data);
  }

  getLoginData(): User | any {
    return this.userDataSubject.value;
  }

  setComponentId(id: string): void {
    this.componentId = id;
  }

  getComponentId(): string | null {
    return this.componentId;
  }

  setJsonData(data: string): void {
    this.jsonData = data;
  }

  getJsonData(): string {
    return this.jsonData;
  }
}
