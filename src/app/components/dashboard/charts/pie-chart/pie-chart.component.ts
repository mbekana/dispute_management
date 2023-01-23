import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from 'ng2-charts';
import { Observable } from 'rxjs';
import { OtherBankDisputeService } from 'src/app/services/other-bank-dispute/other-bank-dispute.service';
import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  activeUserRole$!: Observable<string>;
  allRequests: any[] = [];
  loggedInUsersRequest: any[] = [];

  otherBanksRequests:any[] = [];

  // types
  offus: number = 0;
  onus: number = 0;
  otherOnEnat: number = 0;
  notFoundOnSettlementDoc: number = 0;

  // data loading status
  isLoaded: boolean = false;

  // pageINfo

  pageNumber:number=0;
  pageSize:number=10;

  public pieChartLabels: Label[] = [
    'OFF-US',
    'ON-US',
    'OTHER-ON-ENAT',
    'NOT-FOUND',
  ];
  public pieChartColors: Array < any > = [{
    backgroundColor: ['#00897b', '#0288d1', '#d81b60', '#8d6e63'],
    borderColor: ['rgba(252, 235, 89, 0.2)', 'rgba(77, 152, 202, 0.2)', 'rgba(241, 107, 119, 0.2)']
  }];
 
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(
    private otherBankDisputeService:OtherBankDisputeService,
    private disputeRequestService:DisputeRequestService
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    // this.activeUserRole$ = this.userService.user_role;
    // this.activeUserRole$.subscribe((res) => {
      // if (res === 'ROLE_BANKING' || res === 'ROLE_APPROVER') {
        this.onGetDirectRequests();
        this.onGetAllRequests();
        // console.log(this.offus, this.onus, this.otherOnEnat, this.notFoundOnSettlementDoc)
        this.pieChartData = [
          this.offus,
          this.onus,
          this.otherOnEnat,
          this.notFoundOnSettlementDoc,
        ];
      // } else if (res === 'ROLE_USER') {
        this.onGetLoggedInUsersRequest();
        console.log(this.offus, this.onus, this.otherOnEnat, this.notFoundOnSettlementDoc)

      // }
    // });
  }

  onGetAllRequests = () => {
    this.disputeRequestService.getDisputeRequests(this.pageNumber, this.pageSize).subscribe(
      (res:any) => {
        this.allRequests = res?._embedded?.disputeRequestDtoes;
        this.isLoaded = true;
        this.onCountRequestTypesStep(this.allRequests);
        this.pieChartData = [
          this.offus,
          this.onus,
          this.otherOnEnat,
          this.notFoundOnSettlementDoc,
        ];
      },
      (error:any) => {
        this.isLoaded = false;
      }
    );
  };

  onGetLoggedInUsersRequest = () => {
    this.disputeRequestService.getDisputeRequestByRequestInitiator(this.pageNumber, this.pageSize).subscribe(
      (res:any) => {
        this.loggedInUsersRequest = res?._embedded.disputeRequestDtoes;
        this.isLoaded = true;
        this.onCountRequestTypesStep(this.loggedInUsersRequest);
        this.pieChartData = [
          this.offus,
          this.onus,
          this.otherOnEnat,
          this.notFoundOnSettlementDoc,
        ];
      },
      (error:any) => {
        this.isLoaded = false;
      }
    );
  };

  onCountRequestTypesStep = (request: any) => {
    request.forEach((element: any) => {
      if (element.requestType == 'ENAT_ENAT') {
        this.onus += 1;
      } else if (element.requestType == 'ENAT_ON_OTHER_BANK') {
        this.offus += 1;
      } else if (element.requestType == 'OTHER_BANK_ON_ENAT') {
        this.otherOnEnat += 1;
      } else if (element.requestType == 'NOT_FOUND_ON_SETTLEMENT') {
        this.notFoundOnSettlementDoc += 1;
      }
    });
  };


  onGetDirectRequests = () =>{
    this.otherBankDisputeService.getDirectRequests().subscribe(res=>{
      this.otherBanksRequests = res?._embedded?.otherBanksRequestsDtoes;
      this.onCountRequestTypesStep(this.otherBanksRequests);
    })
  }

}
