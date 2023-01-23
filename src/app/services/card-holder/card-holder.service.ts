import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.SERVER_API;

@Injectable({
  providedIn: 'root'
})
export class CardHolderService {

  constructor(private http:HttpClient) { }

  getCardHoldeInfo = (pageNumber?:number, pageSize?:number, accountNumber?:string):Observable<any> =>{
    const params = new HttpParams()
    .append('page', `${pageNumber}`)
    .append('size', `${pageSize}`)
    .append('accountNumber', `${accountNumber}`)
    return this.http.get<any>(`${baseUrl}/card-holder-details`, {params})
  } 

}
