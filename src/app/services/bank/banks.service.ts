import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banks, BanksResponse } from 'src/app/models/banks';

import { environment } from 'src/environments/environment';

const baseUrl = environment.SERVER_API;


@Injectable({
  providedIn: 'root'
})
export class BanksService {

  constructor(private banksHttp:HttpClient) {}

  getAllBanks = (pageNumber:number, pageSize:number):Observable<any>=>{
    const params = new HttpParams()
    .append('pageNumber', `${pageNumber}`)
    .append('pageSize', `${pageSize}`)
     return this.banksHttp.get<any>(`${baseUrl}/banks`, {params});
  }

  createBank(bank: Banks): Observable<any>{
    return this.banksHttp.post<any>(`${baseUrl}/banks`, bank);
  }

  updateBank(id:number, bank:Banks):Observable<BanksResponse>{
    return this.banksHttp.put<BanksResponse>(`${baseUrl}/banks/${id}`, bank);
  }

  deleteBank(id:number):Observable<any>{
    return this.banksHttp.delete<BanksResponse>(`${baseUrl}/banks/${id}`);
  }

  getBankById(id:number):Observable<BanksResponse>{
    return this.banksHttp.get<BanksResponse>(`${baseUrl}/banks/${id}`);
  }

  
  searchBanks = (search:any):Observable<any> =>{
    const params = new HttpParams()
    .append('search', `${search}`)
    return this.banksHttp.get(`${baseUrl}/banks/search`, {params});
  }
  
}
