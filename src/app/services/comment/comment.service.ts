import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.SERVER_API;

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }

  getAllComments = (id:number, pageNumber:number, pageSize:number):Observable<any> =>{
    const params = new HttpParams()
    .append('pageNumber', `${pageNumber}`)
    .append('pageSize', `${pageSize}`);
    return this.http.get<any>(`${baseUrl}/dispute-requests/${id}/comments`, {params});
  }

  createComment = (id:number, data:any):Observable<any> =>{
    return this.http.post<any>(`${baseUrl}/dispute-requests/${id}/comment`, data);
  }

  getComment = (id:number):Observable<any> =>{
    return this.http.get(`${baseUrl}/comments/${id}`);
  }

  editComment = (id:number, data:any):Observable<any> =>{
    return this.http.patch(`${baseUrl}/comments/${id}`, data);
  }

  deleteComment = (id:number) :Observable<any> =>{
    return this.http.patch(`${baseUrl}/comments/delete/{id}`, null);
  }

  readComment = (requestId:number) => {
    return this.http.put(`${baseUrl}/dispute-requests/comment/${requestId}`, null);
  }
}
