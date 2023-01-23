import {Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { Requester } from '../../../models/requester';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css'],
})
export class ApproveComponent implements OnInit {
  creditDate!: string;
  currentRequest: any;
  currentRequestRow!: any;
  isApprover: boolean = true;
  cancelClicked: boolean = false;
  idFromParam: any;

  index!: number;
  id!: number;


  public dataSource = new MatTableDataSource<Requester>();
  public displayedColumns = [
    'id',
    'cardNumber',
    'cardHolderName',
    'status',
    'telephone',
    'transactionDate',
    'transactionAmount',
    'requestType',
    'details',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  data: any;
  isLoaded!: boolean;
  currentUser!: string;

  activeUserRole$!: Observable<string>;

  pageSize: number = 10;
  pageNumber: number = 0;

  errorMessage: any;

  // search
  searchRequestForm!: FormGroup;
  loading: boolean = false;
  transactionDate: any;
  params: any[] = [];

  parameter!: string;

  allrequests:any[]=[];
  onusRequests:any[]=[];
  offusRequests:any[]=[];
  notfoundRequests:any[]=[];
  acknowledgedDisputeRequests:any[]=[];
  total:number=0;

  selected = new FormControl(0);

  searchFormVisible:boolean = false;

  selectedTabIndex: number = 0;
  accessRoles: any;

  paramFromRoute:any;
  statusFromRoute:any;


  // new Data variables
  initation:any[]=[];
  processing:any[]=[];
  declined:any[]=[];
  reversed:any[]=[];
  approved:any[]=[];
  settled:any[]=[];

  isAcknowloedged!:boolean;

  constructor(
    private disputeRequestService: DisputeRequestService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private fb: FormBuilder
  ) {

    this.paramFromRoute = this.route.snapshot.data['disputeType'];
    this.statusFromRoute = this.route.snapshot.data['status']
    this.isAcknowloedged = this.route.snapshot.data['isAcknowloedged']
    this.searchRequestForm = this.fb.group({
      cardHolderName: [''],
      cardNumber: [''],
      transactionDate: [''],
      feNumber: [''],
    });

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.onGetOnUsRequests();
  }

  ngOnInit(): void {

    this.getRoles();
    this.getRecord(this.currentRequestRow);
    this.getAllRequests();
    // if(this.hasDisputeDBAdminRole()){
    //   this.onGetOnUsRequests();
    // }

    // if(this.hasDisputeApproverRole()){
    //   this.onGetAcknowledgedRequests();
    // }

    
    if(this.hasDisputeApproverRole() && !this.isAcknowloedged){
      this.onGetAcknowledgedRequests(this.pageNumber, this.pageSize,  'ENAT_ENAT', this.statusFromRoute);
    }else if(this.isAcknowloedged){
      this.onGetAcknowledgedDisputeRequests(this.pageNumber, this.pageSize)
    }else if(this.hasEbankingUserRole()){
      this.onGetRequestByRequestTypeAndStatus(this.pageNumber, this.pageSize, this.paramFromRoute, 'INITIATION');
    }
   
    

        
    this.searchRequestForm.valueChanges.subscribe((res) => {
      if (
        res.requesterName === '' ||
        res.transactionDate === '' ||
        res.feNumber === ''
      ) {
        this.getAllRequests(this.pageNumber, this.pageSize);
      }
    });

 
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



  getAllRequests = (pageNumber?: number, pageSize?: number) => {
    this.disputeRequestService
      .getDisputeRequests(pageNumber, pageSize)
      .subscribe(
        (res: any) => {
          this.allrequests = res.content;
          this.isLoaded = true;
          this.total = res.totalElements;
          console.log(this.allrequests, 'all');
          // }, 3000);
        },
        (error: any) => {
          this.isLoaded = false;
          this.errorMessage = <any>error;
        }
      );
  };

  onGetAcknowledgedRequests = (pageNumber?: number, pageSize?: number, requestType?:string, status?:string) => {
    this.disputeRequestService
      .getAcknowledgedDisputeRequstsByRequestTypeAndStatus(pageNumber, pageSize, requestType, status)
      .subscribe(
        (res:any) => {
          this.isLoaded = true;
          if(requestType === 'ENAT_ENAT'){
            this.onusRequests = res?._embedded?.disputeRequestDtoes;
          }else if(requestType === 'ENAT_ON_OTHER_BANK'){
            this.offusRequests = res?._embedded?.disputeRequestDtoes;
          } else if(requestType === 'NOT_FOUND_ON_SETTLEMENT'){
            this.notfoundRequests = res?._embedded?.disputeRequestDtoes;
          }
          
        },
        (error: any) => {
          this.isLoaded = false;
          this.errorMessage = <any>error;
        }
      );
  };

  getRecord(row_data: number) {
    this.currentRequestRow = row_data;
  }

  navigate(request: any) {
    this.router.navigate(['/approver', request]);
  }



  navigateToDetails(element: number) {
    this.router.navigate(['/requests/', element]);
    console.log(element, 'id');
  }

  goBack() {
    this.router.navigate(['/checker']);
  }



  pageChanged = (event: PageEvent) => {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    if(this.selectedTabIndex === 0){
      let requestType = 'ENAT_ENAT';
      // this.onGetOnUsRequests(this.pageNumber, tonGetRequestByRequestTypeAndStatushis.pageSize, requestType)
    }else if(this.selectedTabIndex === 1){
      let requestType = 'ENAT_ON_OTHER_BANK';
      // this.getOffUsRequests(this.pageNumber, this.pageSize, requestType);
    } else if(this.selectedTabIndex === 2){
      let requestType='NOT_FOUND_ON_SETTLEMENT';
      this.onGetNotFoundOnSettlement(this.pageNumber, this.pageSize, requestType);
    } else if(this.selectedTabIndex === 3){
      this.onGetAcknowledgedRequests(this.pageNumber, this.pageSize);
    }
    
    
  };

  onSearchRequest() {
    // console.log(this.searchPurchaseReceiveForm.value)
    this.loading = true;
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
          this.params.push([`${key}:'${this.transactionDate}'`]);
        } else if (key.indexOf('cardHolderName') > -1) {
          this.params.push([
            `cardHolderName:'*${this.searchRequestForm.get('cardHolderName')?.value}*'`,
          ]);
        } else if (key.indexOf('cardNumber') > -1) {
          this.params.push([
            `cardNumber:'*${this.searchRequestForm.get('cardNumber')?.value}*'`,
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
    this.disputeRequestService.searchDisputeRequest(this.parameter).subscribe(
      (res:any) => {
        if(this.selectedTabIndex === 0){
          this.loading = false;
          this.onusRequests = res?._embedded?.disputeRequestDtoes;
        }else if(this.selectedTabIndex === 1){
          this.loading = false;
          this.offusRequests = res?._embedded?.disputeRequestDtoes;
        }else if(this.selectedTabIndex === 2){
          this.loading = false;
          this.notfoundRequests = res?._embedded?.disputeRequestDtoes;
        }else if(this.selectedTabIndex === 3){
          this.loading = false;
          this.acknowledgedDisputeRequests = res?._embedded?.disputeRequestDtoes;
        }
      },
      (error:any) => {
        this.loading = false;
      }
    );
  }

  onGetRequestByRequestTypeAndStatus = (pageNumber?:number, pageSize?:number, rType?:string, status?:string) =>{
      this.disputeRequestService.getDisputeRequstsByRequestTypeAndStatus(this.pageNumber, this.pageSize, rType, status).subscribe((res:any)=>{
        if(status === 'INITIATION'){
          this.initation = res?._embedded?.disputeRequestDtoes;
        } else if(status === 'PROCESSING'){
          this.processing = res?._embedded?.disputeRequestDtoes;
        } else if(status === 'REVERSED'){
          this.reversed = res?._embedded?.disputeRequestDtoes;
        }else if(status === 'DECLINED'){
          this.declined = res?._embedded?.disputeRequestDtoes;
        }else if(status === 'SETTLED'){
          this.settled = res?._embedded?.disputeRequestDtoes;
        }else if(status === 'APPROVED'){
          this.approved = res?._embedded?.disputeRequestDtoes;
        }
      })
  }



  onGetNotFoundOnSettlement = (pageNumber?:number, pageSize?:number, rType?:string) =>{
    let requestType='NOT_FOUND_ON_SETTLEMENT';
    this.disputeRequestService.getDisputeRequstsByRequestTypeAndStatus(this.pageNumber, this.pageSize, requestType).subscribe((res:any)=>{
      this.notfoundRequests = res?._embedded?.disputeRequestDtoes;;
    })
  }

  onToggleAdvancedSearch = () =>{
    this.searchFormVisible = !this.searchFormVisible;
  }

  onSelectChange = (event:number) =>{
    if(event === 0){
      this.onGetRequestByRequestTypeAndStatus(this.pageNumber, this.pageSize, this.paramFromRoute,'INITIATION')
    }else if(event === 1){
      this.onGetRequestByRequestTypeAndStatus(this.pageNumber, this.pageSize, this.paramFromRoute,'PROCESSING')
    }else if(event === 2){
      this.onGetRequestByRequestTypeAndStatus(this.pageNumber, this.pageSize, this.paramFromRoute,'DECLINED')
    }else if(event === 3){
      this.onGetRequestByRequestTypeAndStatus(this.pageNumber, this.pageSize, this.paramFromRoute,'REVERSED')
    }else if(event === 4){
      this.onGetRequestByRequestTypeAndStatus(this.pageNumber, this.pageSize, this.paramFromRoute,'APPROVED')
    }else if(event === 5){
      this.onGetRequestByRequestTypeAndStatus(this.pageNumber, this.pageSize, this.paramFromRoute,'SETTLED')
    }
    
  }

  acknowledgeTabChange = (event:number)=>{
    if(event === 0){
      this.onGetAcknowledgedRequests(this.pageNumber, this.pageSize,  'ENAT_ENAT', this.statusFromRoute );
    }else if(event === 1){
      this.onGetAcknowledgedRequests(this.pageNumber, this.pageSize,  'ENAT_ON_OTHER_BANK', this.statusFromRoute);
    }else if(event === 2){
      this.onGetAcknowledgedRequests(this.pageNumber, this.pageSize, 'NOT_FOUND_ON_SETTLEMENT', this.statusFromRoute );
    }
  }

  onGetAcknowledgedDisputeRequests = (pageNumber?:number, pageSize?:number) =>{
    this.disputeRequestService.getAcknowledgedDisputeRequests(pageNumber, pageSize).subscribe((res:any)=>{
      this.acknowledgedDisputeRequests = res?._embedded?.disputeRequestDtoes;
    })
  }

}
