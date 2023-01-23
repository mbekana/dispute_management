import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Branch } from '../../models/branch';

const hr_host = environment.HR_HOST

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})


export class BranchService {

  constructor(private http:HttpClient) {}
  getBranches():Observable<Branch[]>
  {
    return this.http.get<Branch[]>(`${hr_host}/branches`);
  }

}
