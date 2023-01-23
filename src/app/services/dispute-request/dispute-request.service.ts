import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DisputeRequest, DisputeRequestResponse } from 'src/app/models/dispute-request/dispute-request';
import { environment } from 'src/environments/environment';

const baseUrl = environment.SERVER_API;

@Injectable({
  providedIn: 'root'
})
export class DisputeRequestService {

  constructor(private http:HttpClient) { }


  createDisputeRequest = (disputeRequest: DisputeRequest) :Observable<DisputeRequest>=> {
    return this.http.post<DisputeRequest>(
      `${baseUrl}/dispute-requests`,
      disputeRequest
    );
  }

  getDisputeRequests = (pageIndex?:number, pageSize?:number) :Observable<DisputeRequestResponse> =>{
    const params = new HttpParams()
    .append('page', `${pageIndex}`)
    .append('size', `${pageSize}`)
    return this.http.get<DisputeRequestResponse>(`${baseUrl}/dispute-requests`, {params});
  }

  getDisputeRequest = (id:number) :Observable<DisputeRequestResponse> =>{
    return this.http.get<DisputeRequestResponse>(`${baseUrl}/dispute-requests/${id}`);
  }

  updateDisputeRequest = (id:number, disputeRequest:DisputeRequest) :Observable<DisputeRequest> =>{
    return this.http.put<DisputeRequest>(`${baseUrl}/dispute-requests/update/${id}`, disputeRequest)
  }


  receiveDisputeRequest = (id:number, data:any):Observable<any> =>{
    return this.http.put<any>(`${baseUrl}/dispute-requests/receive/${id}`, data);
  }

  acknowledgeDisputeRequest = (id:number, data:any):Observable<any> =>{
    return this.http.put<any>(`${baseUrl}/dispute-requests/acknowledge/${id}`, data);
  }


  getAcknowledgedDisputeRequstsByRequestTypeAndStatus = (pageIndex?:number, pageSize?:number, requestType?:string, status?:string) :Observable<DisputeRequestResponse> =>{
    const params = new HttpParams()
    .append('page', `${pageIndex}`)
    .append('size', `${pageSize}`)
    .append('requestType', `${requestType}`)
    .append('status', `${status}`)
    return this.http.get<DisputeRequestResponse>(`${baseUrl}/dispute-requests/acknowledged`, {params})
  }


  // for ebanking user
  getDisputeRequstsByRequestTypeAndStatus = (pageIndex?:number, pageSize?:number, requestType?:string, status?:string) :Observable<DisputeRequestResponse> =>{
    const params = new HttpParams()
    .append('requestType', `${requestType}`)
    .append('status', `${status}`)
    .append('page', `(${pageIndex})`)
    .append('size', `(${pageSize})`)
    return this.http.get<DisputeRequestResponse>(`${baseUrl}/dispute-requests/requestType`, {params})
  }


  // for request initiator
 getDisputeRequestByBranchAndRequestType = (pageIndex?:number, pageSize?:number, requestType?:string) :Observable<any> =>{
  const params = new HttpParams()
  .append('page', `(${pageIndex})`)
  .append('size', `(${pageSize})`)
  .append('requestType', `${requestType}`)
  return this.http.get<any>(`${baseUrl}/dispute-requests/branch-and-request-type`, {params})
 }

 getDisputeRequestByRequestInitiator = (pageIndex?:number, pageSize?:number) :Observable<any>=>{
  const params = new HttpParams()
  .append('page', `(${pageIndex})`)
  .append('size', `(${pageSize})`)
  return this.http.get<any>(`${baseUrl}/dispute-requests/maker`, {params})
 }

 getDisputeRequestByBranchCode = (pageIndex?:number, pageSize?:number) :Observable<any> =>{
  const params = new HttpParams()
  .append('page', `(${pageIndex})`)
  .append('size', `(${pageSize})`)
  return this.http.get<any>(`${baseUrl}/dispute-requests/branch-code`, {params})
 }

 getDisputeRequestByPayerBranch = (pageIndex?:number, pageSize?:number) :Observable<any> =>{
  const params = new HttpParams()
  .append('page', `(${pageIndex})`)
  .append('size', `(${pageSize})`)
  return this.http.get<any>(`${baseUrl}/dispute-requests/payer-branch`, {params})
 }


 getDisputeRequestsToBeExpired = (pageIndex?:number, pageSize?:number) :Observable<any> =>{
  const params = new HttpParams()
  .append('page', `(${pageIndex})`)
  .append('size', `(${pageSize})`)
  return this.http.get<any>(`${baseUrl}/dispute-requests/expiring`, {params})
 }

 getLastFiveNewDisputeRequestsByBranch = ():Observable<any>=>{
  return this.http.get<any>(`${baseUrl}/dispute-requests/last-five-new requests-by-branch`);
 }

 getLatestFiveRequestsFromAllBranches = () :Observable<any> =>{
  return this.http.get<any>(`${baseUrl}/dispute-requests/last-five-from-all-branches`);
 }

 markDisputeRequestAsNotFound = (id:number) :Observable<any> =>{
  return this.http.put<any>(`${baseUrl}/dispute-requests/not-found/${id}`, null)
 }

 approveDisputeRequest = (id:number) :Observable<any> =>{
  return this.http.put<any>(`${baseUrl}/dispute-requests/approve/${id}`, null);
 }


 declineRequest = (id:number, data:any):Observable<any> =>{
  return this.http.put<any>(`${baseUrl}/decline/{id}`, data)
 }


 searchDisputeRequest = (search:any):Observable<any> =>{
  const params = new HttpParams()
  .append('search', `${search}`)
  return this.http.get(`${baseUrl}/dispute-requests/search`, {params});
}


confirmSettlement = (id:number):Observable<any> =>{
  return this.http.put<any>(`${baseUrl}/dispute-requests/confirm-settlement/${id}`, null);
}



getAcknowledgedDisputeRequests = (pageNumber?:number, pageSize?:number) :Observable<any> =>{
  const params = new HttpParams()
  .append('page', `(${pageNumber})`)
  .append('size', `(${pageSize})`)
  return this.http.get<any>(`${baseUrl}/dispute-requests/acknowledged/no-stat`, {params});
}

}
