import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DisputeRequest } from 'src/app/models/dispute-request/dispute-request';
import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';


@Component({
  selector: 'app-tip-about-requests',
  templateUrl: './tip-about-requests.component.html',
  styleUrls: ['./tip-about-requests.component.css']
})
export class TipAboutRequestsComponent implements OnInit {

  @ViewChild('nextButton') nextButton!: ElementRef;
  
  pageNumber:number=0;
  pageSize:number=1;
  timeIntevalSeconds:number=10;
  total:number=0;

  requestsForTip:any[]=[];
  receivedDate!:Date;
  filteredRequest:any[]=[];
  errorMessage:any;
  constructor( public dialogRef: MatDialogRef<TipAboutRequestsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private disputeRequestService:DisputeRequestService,
    private datePipe:DatePipe,
    private router:Router
    ) { 
      
    }

  ngOnInit(): void {
    this.onGetExpiringRequests(this.pageNumber, this.pageSize);
    
  }


  onGetExpiringRequests = (pageNumber:number, pageSize:number) =>{
    this.disputeRequestService.getDisputeRequestsToBeExpired(pageNumber, pageSize).subscribe((res:any)=>{
      this.filteredRequest = res?._embedded?.disputeRequestDtoes;
      this.data = this.filteredRequest;
      console.log(this.filteredRequest)
      this.total = res.totalElements;
            
    },
    (error:any)=>{
      this.errorMessage = error;
    }
    ) 
  }

  onNavigateToEdit = (id:number) =>{
    this.router.navigate(["requests/edit/", id])
  }


  fetchTipData = (event:PageEvent) =>{
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.onGetExpiringRequests(this.pageNumber, this.pageSize)
  }

}
