import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BanksService } from 'src/app/services/bank/banks.service';
import { OtherBankDisputeService } from 'src/app/services/other-bank-dispute/other-bank-dispute.service';
import { scan } from 'rxjs/operators';

@Component({
  selector: 'other-bank-dispute-request',
  templateUrl: './other-bank-dispute-request.component.html',
  styleUrls: ['./other-bank-dispute-request.component.css'],
})
export class OtherBankDiputeRequest implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns = [
    'id',
    'issuerBank',
    'acquirerBank',
    'cardNumber',
    'amount',
    'transactionDate',
    'requestType',
    'feNumber',
    'disputeId',
    'edit',
    'details',
  ];

  isLoaded!: boolean;

  // search
  searchOtherBankDisputeRequestForm!: FormGroup;
  loading: boolean = false;
  transactionDate: any;
  params: any[] = [];

  parameter!: string;

  errorMessage: any;

  searchFormVisible: boolean=false;

  total:number=0;

  otherBankDisputeRequests:any[]=[];
  pageNumber:number=0;
  pageSize:number=10;

  banks:any[]=[];

  options = new BehaviorSubject<any[]>([]);
  options$: Observable<any[]>;

  constructor(
    private otherBankDisputeService: OtherBankDisputeService,
    private router: Router,
    private fb: FormBuilder,
    private bankService:BanksService
  ) {

    this.options$ = this.options.asObservable().pipe(
      scan((acc: any, curr: any) => {
        return [...acc, ...curr];
      }, [])
    );

    this.searchOtherBankDisputeRequestForm = fb.group({
      issuerBank: [''],
      transactionDate: [''],
      feNumber: [''],
      disputeId:[''],
      cardNumber:['']
    });
  }

  ngOnInit(): void {
    this.getBanks();
  }

  ngAfterViewInit(): void {
    this.getDirectRequests();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDirectRequests = () => {
    this.otherBankDisputeService.getDirectRequests().subscribe(
      (res) => {
        this.isLoaded = true;
        this.otherBankDisputeRequests = res?._embedded?.otherBanksDisputeDtoes
        this.isLoaded = true;
      },

      (error) => {
        console.log(error);
        this.isLoaded = false;
        this.errorMessage = <any>error;
      }
    );
  };

  onNavigateToNewRequest = () => {
    this.router.navigate(['/direct-requests/create']);
  };

  goToHistory = () => {};

  onNavigateToDetails = (id: number) => {
    this.router.navigate(['/direct-requests/details/', id]);
  };

  onNavigateToEdit = (id: number) => {
    this.router.navigate(['/direct-requests/edit/', id]);
  };

  onSearchRequest() {
    // console.log(this.searchPurchaseReceiveForm.value)
    this.loading = true;
    if (this.searchOtherBankDisputeRequestForm.get('transactionDate')?.value) {
      this.transactionDate = new Date(
        this.searchOtherBankDisputeRequestForm.get('transactionDate')?.value.getTime() -
          this.searchOtherBankDisputeRequestForm
            .get('transactionDate')
            ?.value.getTimezoneOffset() *
            60000
      )
        .toISOString()
        .split('T')[0];
    } else this.transactionDate = undefined;
    this.params = [];
    Object.keys(this.searchOtherBankDisputeRequestForm.controls).forEach(
      (key: string) => {
        if ((<any>this.searchOtherBankDisputeRequestForm.get(key)).value) {
          if (key.indexOf('transactionDate') > -1) {
            this.params.push([`transactionDate:*${this.transactionDate}*`]);
          } else if (key.indexOf('issuerBank') > -1) {
            this.params.push([
              `issuerBank.name:'${this.searchOtherBankDisputeRequestForm.get("issuerBank")?.value?.name
              }'*`
            ]);
          } else if (key.indexOf('cardNumber') > -1) {
            this.params.push([
              `cardNumber:${
                this.searchOtherBankDisputeRequestForm.get('cardNumber')?.value
              }`,
            ]);
          } else if (key.indexOf('feNumber') > -1) {
            this.params.push([
              `feNumber:${this.searchOtherBankDisputeRequestForm.get('feNumber')?.value}`,
            ]);
          } else if (key.indexOf('disputeId') > -1) {
            this.params.push([
              `disputeId:${
                this.searchOtherBankDisputeRequestForm.get('disputeId')?.value
              }`,
            ]);
          }
        }
      }
    );

    this.parameter = this.params.join(' AND ');
    console.log(this.parameter);
    this.otherBankDisputeService.searchOtherBankDispute(this.parameter).subscribe(
      (res) => {
        this.loading = false;
        this.dataSource = <any>res;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onToggleAdvancedSearch = () =>{
    this.searchFormVisible = !this.searchFormVisible;
  }

  navigateToCreateDisputeRequest = () =>{

  }

  pageChanged(event:PageEvent){

  }


  getBanks() {
    this.bankService
      .getAllBanks(this.pageNumber, this.pageSize)
      .subscribe((response: any) => {
        this.banks = response?._embedded.bankDtoes;
        console.log(this.banks)
        this.options.next(this.banks);
        console.log(this.banks, 'banks');
        // this.message = response.message;
      });
  }

  onScrollDown = () => {
    this.bankService
      .getAllBanks(this.pageNumber, this.pageNumber + this.pageSize)
      .subscribe(
        (response: any) => {
          this.banks = response.content;
          this.options.next(this.banks);
          this.pageNumber += this.pageSize;
        },
        (error: any) => {}
      );
  };

}
