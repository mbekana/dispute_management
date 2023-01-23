import {Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';
import { DisputeRequest, DisputeRequestResponse } from 'src/app/models/dispute-request/dispute-request';



@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
  currentRequest: any;
  currentRequestRow!: any;

  isChecker: boolean = true;
  cancelClicked: boolean = false;

  public displayedColumns = [
    'id',
    'cardNumber',
    'cardHolderName',
    'status',
    'telephone',
    'transactionDate',
    'transactionAmount',
    'requestType',
    'edit',
    'details',
  ];

   
  isLoaded:boolean=false;

  // page infos
  pageSize:number=10;
  pageNumber:number=0;
  total:number=0;
  currentPage:number=0;
  toggledTab!:number;

  // search
  searchRequestForm!:FormGroup;
  loading: boolean = false;
  transactionDate:any;
  params:any[]=[];

  parameter!: string;
  errorMessage: any;


  requests :any[]=[];
  assignedRequest: any[] =[];
  initiatorBranchRequests: any[]=[];
  assignedSettledRequests: number = 0;

  // new migrated
  disputeRequestResponse!:DisputeRequestResponse;
  requestedDisputeRequests:DisputeRequest[]=[];
  branchCode:any;

  selected = new FormControl(0);
  selectedTabIndex: number = 0;

  searchFormVisible: boolean=false;

  
  constructor(
    private disputeRequestService: DisputeRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private fb:FormBuilder
  ) {

    this.searchRequestForm = fb.group({
      cardHolderName: [""],
      cardNumber: [""],
      transactionDate: [""],
      feNumber:[""],

    });

  }


  ngOnInit() {
    // new Migration code
    this.onGetRequestByBranchCode(this.pageNumber, this.pageSize, 'ENAT_ENAT');
  
  }



  onNavigateToDetails = (id:number) =>{
    this.router.navigate(['/requests', id])
  }

  navigateToCreateDisputeRequest = () =>{
    this.router.navigate(['/request-refund'])
  }


  pageChanged = (event: PageEvent) =>{
    console.log({ event });
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.onGetRequestByBranchCode(this.pageNumber, this.pageSize)
  }

  onNavigateToEdit = (id:number) =>{
    this.router.navigate(["requests/edit/", id])
  }



  /*search */
  onSearchRequest() {
    // console.log(this.searchPurchaseReceiveForm.value)
    this.loading = true;
    if (this.searchRequestForm.get('transactionDate')?.value) {
      this.transactionDate = new Date(
        this.searchRequestForm.get('transactionDate')?.value.getTime() -
        this.searchRequestForm.get('transactionDate')?.value.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0]
    }
    else
    this.transactionDate = undefined;
    this.params = [];
    Object.keys(this.searchRequestForm.controls).forEach((key: string) => {
      if ((<any>this.searchRequestForm.get(key)).value) {
        if (key.indexOf('transactionDate') > -1) {
          this.params.push([`${key}:${this.transactionDate}`]);
        }
        else if (key.indexOf('cardHolderName') > -1 ) {
          this.params.push([`cardHolderName:'${this.searchRequestForm.get('cardHolderName')?.value}*'`]);
        }else if (key.indexOf('cardNumber') > -1 ) {
          this.params.push([`cardNumber:${this.searchRequestForm.get('cardNumber')?.value}`])
        }else if(key.indexOf('telephone') > -1){
          this.params.push([`telephone:${this.searchRequestForm.get('telephone')?.value}`])
        }else if(key.indexOf('feNumber') > -1){
          this.params.push([`feNumber:${this.searchRequestForm.get('feNumber')?.value}`])
        }else if(key.indexOf('disputeId') > -1){
          this.params.push([`disputeId:${this.searchRequestForm.get('disputeId')?.value}`])
        }
      }
    });

    this.parameter = this.params.join(" AND ");
    console.log(this.parameter)
    this.disputeRequestService.searchDisputeRequest(this.parameter).subscribe(res => {
      this.loading = false;
      this.requestedDisputeRequests = res?._embedded.disputeRequestDtoes;
    },
    error=>{
      this.loading = false;
    }
    )

  }


  // Newly migrated Code
  onGetRequestByBranchCode = (pageIndex?:number, pageSize?:number, requestType?:string) =>{
    this.isLoaded = false;
    this.disputeRequestService.getDisputeRequestByBranchCode(pageIndex,pageSize).subscribe((res:any)=>{
      this.isLoaded = true;
      this.disputeRequestResponse = res;
      this.requestedDisputeRequests = res?._embedded.disputeRequestDtoes;
    },
    (error:any)=>{
      this.isLoaded = false;
    }
    )
  }


  onToggleAdvancedSearch = () =>{
    this.searchFormVisible = !this.searchFormVisible;
  }


}
