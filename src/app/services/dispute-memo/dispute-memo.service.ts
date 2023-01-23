import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.SERVER_API;

@Injectable({
  providedIn: 'root'
})
export class DisputeMemoService {

  constructor(private http:HttpClient) { }

  createDisputeMemo = (id:number, data:any):Observable<any> =>{
  
    return this.http.post(`${baseUrl}/dispute-memos/${id}`, data);
  }

  getDisputeMemoById = (id:number):Observable<any> =>{
    return this.http.get(`${baseUrl}/dispute-memos/${id}`);
  }

  updateDisputeMemo = (id:number, data:any):Observable<any>=>{
    return this.http.put(`${baseUrl}/dispute-memos/${id}`, data)
  }
}
