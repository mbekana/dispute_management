import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';

// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-requests',
  templateUrl: './new-requests.component.html',
  styleUrls: ['./new-requests.component.css']
})
export class NewRequestsComponent implements OnInit {

  displayedColumns = [
    "id",
    "status",
    "cardHolderName",
    "cardNumber",
    "transactionAmount",
    "details",
    // "paymentMode",
  ];
  latestFiveRequests:any[]=[];
  accessRoles: any;
  
  constructor(private disputeRequestService:DisputeRequestService, 
    private authService:AuthService
    ) { }

  ngOnInit(): void {
    this.getRoles();
      if (this.hasEbankingUserRole()) {
        this.onGetNewRequestsFromBranch();
      } else if (this.hasDisputeInitiatorRole()) {
        this.onGetLatestFiveRequests();
      }
    
  }


  getRoles()
  {
   this.accessRoles =  this.authService.getUserRoles();
   console.log(this.accessRoles)
  }


  hasDisputeInitiatorRole = () =>{
    if(this.accessRoles.includes("dispute_initiator")){
      return true;
    }
    else return false;
  }

  hasDisputeApproverRole = () =>{
    if(this.accessRoles.includes("dispute_approver")){
      return true;
    }
    else return false;
  }

  hasEbankingUserRole = () =>{
    if(this.accessRoles.includes("ebanking_user")){
      return true;
    }
    else return false;
  }

  hasDisputeDBAdminRole = () =>{
    if(this.accessRoles.includes("dispute_db_admin")){
      return true;
    }
    else return false;
  }


  onGetNewRequestsFromBranch = () =>{
    this.disputeRequestService.getLatestFiveRequestsFromAllBranches().subscribe((res:any)=>{
      this.latestFiveRequests = res?._embedded?.disputeRequestDtoes;
    })
  }

  onGetLatestFiveRequests = () =>{
    this.disputeRequestService.getLastFiveNewDisputeRequestsByBranch().subscribe((res:any)=>{
      this.latestFiveRequests = res?._embedded?.disputeRequestDtoes;
      console.log(this.latestFiveRequests)
    },
    (error:any)=>{
      console.log(error.error.message)
    }
    )
  }

  // onGetLastFiveNewDisputeRequestsByBranch = () =>{
  //   this.disputeRequestService.getLastFiveNewDisputeRequestsByBranch().subscribe((res:any)=>{
  //     this.branchLastFiveNewRequests = res?._embedded?.disputeRequestDtoes;
  //   })
  // }

  onNavigateToDetails = (id:number) =>{

  }
}
