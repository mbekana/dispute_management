import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipAboutRequestsComponent } from '../shared/tip-about-requests/tip-about-requests.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: { cols: 1, rows: 1 },
          chart: { cols: 1, rows: 2 },
          table: { cols: 1, rows: 4 },
        };
      }

      return {
        columns: 4,
        miniCard: { cols: 1, rows: 1 },
        chart: { cols: 2, rows: 2 },
        table: { cols: 4, rows: 4 },
      };
    })
  );

  //data holder variables
  allRequests: any[] = [];
  loggedInUsersRequest: any[] = [];

  // mini card contents
  newRequest: number = 0;
  declined: number = 0;
  processing: number = 0;
  settled: number = 0;

  // data loading status
  isLoaded: boolean = false;

// page info
pageNumber:number=0;
pageSize:number=10;

pageNumberForTip=0;
pageSizeForTip=1;

errorMessage: any;
enterAnimationDuration:string='1000ms';
exitAnimationDuration:string= '500ms';
accessRoles: any;

lastFiveNewRequests:any[]=[];

expiringRequests:any[]=[];
  filteredRequest: any;
  total: number=0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private disputeRequestService: DisputeRequestService,
    private authService: AuthService,
    public dialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.onGetExpiringRequests(this.pageNumberForTip, this.pageSizeForTip);
    this.getRoles();
      if (this.hasEbankingUserRole() || this.hasDisputeApproverRole() || this.hasDisputeDBAdminRole()) {
        this.onGetAllRequests();
      } else if (this.hasDisputeInitiatorRole()) {
        this.onGetDisputeRequestByMaker();
      }if(this.hasEbankingUserRole()){
        setTimeout(() => {
          if (!this.dialog ) return;
          this.openDialog(this.enterAnimationDuration, this.exitAnimationDuration);
         }, 3000);
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

  hasDisputeSystemAdminRole = () =>{
    if(this.accessRoles.includes("dispute_system_admin")){
      return true;
    }
    return false;
  }


  onGetAllRequests = () => {
    this.disputeRequestService.getDisputeRequests(this.pageNumber, this.pageSize).subscribe(
      (res) => {
        this.allRequests = res?._embedded?.disputeRequestDtoes;
        this.isLoaded = true;
        console.log(this.allRequests)
        this.onCountByRequestStatus(this.allRequests);
      },
      (error) => {
        this.isLoaded = false;
        this.errorMessage = <any>error
      }
    );
  };


  onGetDisputeRequestByMaker = () => {
    this.isLoaded = true;
    this.disputeRequestService.getDisputeRequestByRequestInitiator(this.pageNumber, this.pageSize).subscribe(
      (res) => {
        this.loggedInUsersRequest = res._embedded.disputeRequestDtoes;
        this.isLoaded = true;
        console.log(this.loggedInUsersRequest)
        this.onCountByRequestStatus(this.loggedInUsersRequest);
      },
      (error) => {
        this.isLoaded = false;
        this.errorMessage = <any>error
      }
    );
  };
  

  onCountByRequestStatus = (request: any[]) => {
    request.forEach((item, index) => {
      if (item.status === 'INITIATION') {
        this.newRequest += 1;
      } else if (item.status === 'PROCESSING') {
        this.processing += 1;
      } else if (item.status === 'SETTLED' || item.status === 'APPROVED') {
        this.settled += 1;
      } else if (item.status === 'DECLINED') {
        this.declined += 1;
      }
    });
  };

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    
    const dialogRef = this.dialog.open(TipAboutRequestsComponent, {
      width: '630px',
      position:{
        right:'0',
        top:'65px'
      },
    enterAnimationDuration,
    exitAnimationDuration
  });
  }



  onGetExpiringRequests = (pageNumber:number, pageSize:number) =>{
    this.disputeRequestService.getDisputeRequestsToBeExpired(pageNumber, pageSize).subscribe((res:any)=>{
      this.filteredRequest = res?._embedded?.disputeRequestDtoes;
      // this.data = this.filteredRequest;
      console.log(this.filteredRequest)
      this.total = res.totalElements;
            
    },
    (error:any)=>{
      this.errorMessage = error;
    }
    ) 
  }



}
