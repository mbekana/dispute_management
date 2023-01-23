import { Component, OnInit, } from '@angular/core';
import { FormBuilder,  FormGroup } from '@angular/forms';
import {  PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DisputeRequest } from 'src/app/models/dispute-request/dispute-request';
import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';

@Component({
  selector: 'app-assigned-requests',
  templateUrl: './assigned-requests.component.html',
  styleUrls: ['./assigned-requests.component.css']
})
export class AssignedRequestsComponent implements OnInit {

  isLoaded: boolean = false;
  errorMessage:string = '';

  assignedDisputeRequests:DisputeRequest[]=[];

  pageNumber:number=0;
  pageSize:number=10;
  total:number=0;

  searchRequestForm!:FormGroup;

  public displayedColumns = [
    'id',
    'cardNumber',
    'cardHolderName',
    'status',
    'telephone',
    'transactionAmount',
    'requestType',
    'details'

         
  ];


  transactionDate: any;
  params: any[] = [];

  parameter: any;
  searchFormVisible: boolean=false;

  constructor(private disputeRequestSercice:DisputeRequestService, private router:Router, private fb:FormBuilder) {
    this.searchRequestForm = this.fb.group({
      cardHolderName: [""],
      cardNumber: [""],
      transactionDate: [""],
      feNumber:[""],

    });
   }

  ngOnInit(): void {
    this.onGetDisputeRequestByPayerBranch(this.pageNumber, this.pageSize);
  }

  onGetDisputeRequestByPayerBranch = (pageNumber?:number, pageSize?:number) =>{
    this.isLoaded = false;
    this.disputeRequestSercice.getDisputeRequestByPayerBranch(pageNumber, pageSize).subscribe((res:any)=>{
      this.isLoaded = true;
      this.assignedDisputeRequests = res?._embedded?.disputeRequestDtoes;
      this.total = res?.page.totalElements;
    },
    (error:any)=>{
      this.isLoaded = false;
    }
    )
  }

  pageChanged = (event: PageEvent) =>{
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
      this.onGetDisputeRequestByPayerBranch(this.pageNumber, this.pageSize);
  }

  navigateToDetails = (id:number) =>{
    this.router.navigate(['/requests', id])
  }



  onSearchRequest() {
    // console.log(this.searchPurchaseReceiveForm.value)
    this.isLoaded = true;
    if (this.searchRequestForm.get('transactionDate')?.value) {
      this.transactionDate = new Date(
        this.searchRequestForm.get('transactionDate')?.value.getTime() -
          this.searchRequestForm
            .get('transactionDate')
            ?.value.getTimezoneOffset() *
            60000
      )
        .toISOString()
        .split('T')[0];
    } else this.transactionDate = undefined;
    this.params = [];
    Object.keys(this.searchRequestForm.controls).forEach((key: string) => {
      if ((<any>this.searchRequestForm.get(key)).value) {
        if (key.indexOf('transactionDate') > -1) {
          this.params.push([`${key}:*${this.transactionDate}*`]);
        } else if (key.indexOf('cardHolderName') > -1) {
          this.params.push([
            `cardHolderName:*${
              this.searchRequestForm.get('cardHolderName')?.value
            }*`,
          ]);
        } else if (key.indexOf('cardNumber') > -1) {
          this.params.push([
            `cardNumber:${this.searchRequestForm.get('cardNumber')?.value}`,
          ]);
        } else if (key.indexOf('telephone') > -1) {
          this.params.push([
            `telephone:${this.searchRequestForm.get('telephone')?.value}`,
          ]);
        } else if (key.indexOf('feNumber') > -1) {
          this.params.push([
            `feNumber:${this.searchRequestForm.get('feNumber')?.value}`,
          ]);
        } else if (key.indexOf('disputeId') > -1) {
          this.params.push([
            `disputeId:${this.searchRequestForm.get('disputeId')?.value}`,
          ]);
        }
      }
    });

    this.parameter = this.params.join(' AND ');
    console.log(this.parameter);
    this.disputeRequestSercice.searchDisputeRequest(this.parameter).subscribe(
      (res:any) => {
        this.assignedDisputeRequests = res?._embedded?.disputeRequestDtoes;
      },
      (error:any) => {
        this.isLoaded = false;
      }
    );
  }


  onToggleAdvancedSearch = () =>{
    this.searchFormVisible = !this.searchFormVisible;
  }


}
