import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.SERVER_API;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  
  private notificationsSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  public notifications$ = this.notificationsSubject.asObservable();
  constructor(private http: HttpClient) {}

  getAllUnreadNotifications = (
    notificationType:string,
    pageNumber?: number ,
    pageSize?: number 
  ): Observable<any> => {
    const params = new HttpParams()
      .append('notificationType', `${notificationType}`)
      .append('pageNumber', `${pageNumber}`)
      .append('pageSize', `${pageSize}`);
    return this.http.get(`${baseUrl}/notifications/unread`, { params: params });
  };


  getAllUnreadNotificationsByBranchCode = (
    pageNumber?: number,
    pageSize?: number
  ): Observable<any> => {
    const params = new HttpParams()
      .append('pageNumber', `${pageNumber}`)
      .append('pageSize', `${pageSize}`);
    return this.http.get(`${baseUrl}/notifications/unread/branch`, { params: params });
  };

  getNotificationById = (id: number): Observable<any> => {
    return this.http.get(`${baseUrl}/notifications/${id}`);
  };

  getMakerNotification = (
    pageNumber: number = 0,
    pageSize: number = 20
  ): Observable<any> => {
    const params = new HttpParams()
      .append('pageNumber', `${pageNumber}`)
      .append('pageSize', `${pageSize}`);
    return this.http.get(`${baseUrl}/branch/notifications`, { params: params });
  };



  public updateNotifications(value: number): void {
    this.notificationsSubject.next(value);
  }


  unreadNotification = (id:number):Observable<any> =>{
    return this.http.put(`${baseUrl}/notifications/${id}`, null);
  }

}
