import { M } from '@angular/cdk/keycodes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const baseUrl = environment.SERVER_API;

@Injectable({
  providedIn: 'root'
})
export class OtherBankDisputeService {

  constructor(private http:HttpClient) { }

  createDirectRequest = (data:any):Observable<any> =>{
    return this.http.post(`${baseUrl}/other-banks-dispute`, data);
  }

  getDirectRequests = ():Observable<any> =>{
    return this.http.get(`${baseUrl}/other-banks-dispute`);
  }

  getDirectRequest = (id:number):Observable<any> =>{
    return this.http.get(`${baseUrl}/other-banks-dispute/${id}`)
  }

  updateDirectRequest = (id:number, data:any):Observable<any> =>{
    return this.http.put(`${baseUrl}/other-banks-dispute/${id}`, data);
  }


  searchOtherBankDispute = (search:any):Observable<any> =>{
    const params = new HttpParams()
    .append('search', `${search}`)
    return this.http.get(`${baseUrl}/other-banks-dispute/search`, {params});
  }
}
