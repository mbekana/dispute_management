import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const baseUrl = environment.SERVER_API;

@Injectable({
  providedIn: 'root'
})
export class EjService {

  constructor(private http:HttpClient) { }

  uploadAtmElectronicJournal = (
    file: File,
    requesterId: any,
    documentType: any
  ): Observable<HttpEvent<any>> =>{
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('requestId', requesterId);
    formData.append('documentType', documentType);
    const req = new HttpRequest(
      'POST',
      `${baseUrl}/upload-ej-file`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );
    return this.http.request(req);
  }

  // downloadEj = (requestId:number) =>{
  //   const params = new HttpParams()
  //   .append("requestId", `${requestId}`);
  //   // let header = new HttpHeaders();
  //   // header = header.append('content-type', 'application/force');
  //   return this.http.get(`${baseUrl}/upload-ej-file`, {params:params,observe: 'response', responseType: 'blob'});
  // }


  downloadEj(requesterId:number){
    let headers = new HttpHeaders();
    const params = new HttpParams()
    .append("requestId", `${requesterId}`);
    headers = headers.set("Accept", "application/pdf");
    return this.http.get(`${baseUrl}/upload-ej-file`, {
      params:params,
      headers: headers,
      responseType: "blob" as "json",
    });
}

}
