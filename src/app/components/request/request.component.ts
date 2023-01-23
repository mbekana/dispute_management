import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import {
  date,
  NumericValueType,
  RxwebValidators,
} from '@rxweb/reactive-form-validators';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BanksService } from 'src/app/services/bank/banks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { scan } from 'rxjs/operators';
import { BranchService } from 'src/app/services/branch/branch.service';
import { first } from 'rxjs/operators';
import { CardHolderService } from 'src/app/services/card-holder/card-holder.service';
import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class RequestComponent implements OnInit {
  // time: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
  // seconds = true;

  today = new Date();

  message: any;
  user_id!: any;
  new_date: any;
  allBranches: any;
  branchFormForm!: any[];
  selectedBrachName: string = '';
  selectedBankName: string = '';
  isBranchSelectVisible: boolean = false;
  // change_time_format: Date | null = null;
  accountNumber!: string;
  cardHolder!: any;
  banks!: any[];
  currentUserRefundRequest$!: Observable<any[]>;
  filteredOptions!: any;
  isSuccessfullySaved: boolean = false;
  currentRequest: any;
  allRequest: any;

  // page info
  pageNumber: number = 0;
  pageSize: number = 10;

  banksBehaviour = new BehaviorSubject<any[]>([]);
  banks$: Observable<any[]>;

  branchesBehaviour = new BehaviorSubject<any[]>([]);
  branches:any[]=[];

  // edit info
  isAddMode!: boolean;
  requestId!: number;

  errorMessage!:string;

  isLoading!:boolean;
  requestForm!: FormGroup;

  constructor(
    private requestFormBuilder: UntypedFormBuilder,
    private bankService: BanksService,
    private router: Router,
    private datePipe: DatePipe,
    private branchService: BranchService,
    private cardHolderService:CardHolderService,
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private disputeRequestService:DisputeRequestService
  ) {
    this.banks$ = this.banksBehaviour.asObservable().pipe(
      scan((acc: any, curr: any) => {
        return [...acc, ...curr];
      }, [])
    );

    // this.branches$ = this.branchesBehaviour.asObservable().pipe(
    //   scan((acc: any, curr: any) => {
    //     return [...acc, ...curr];
    //   }, [])
    // );



  this.requestForm = this.requestFormBuilder.group({
    // requesterName: ['', [Validators.required, Validators.minLength(10)]],
    cardNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(19),
        Validators.maxLength(19),
        RxwebValidators.numeric({
          acceptValue: NumericValueType.PositiveNumber,
          allowDecimal: false,
        }),
      ],
    ],
    accountNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        RxwebValidators.numeric({
          acceptValue: NumericValueType.PositiveNumber,
          allowDecimal: false,
        }),
      ],
    ],
    address: [''],
    telephone: [''],
    transactionDate: ['', [Validators.required]],
    transactionAmount: [
      '',
      [
        Validators.required,
        RxwebValidators.numeric({
          acceptValue: NumericValueType.PositiveNumber,
          allowDecimal: false,
        }),
      ],
    ],
    bankTerminal: ['', [Validators.required]],
    cardHolderName: ['', [Validators.required]],
    terminalOwnerBranch: [null, ],
    customerStatement: [true, [Validators.required]],
  });


    this.requestId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.isAddMode = !this.requestId;
    this.getAllBanks();
    this.onGetBranches();
    if (!this.isAddMode) {
      this.isLoading=true;
      this.disputeRequestService
        .getDisputeRequest(this.requestId)
        .pipe(first())
        .subscribe((response: any) =>{
          this.isLoading = false;
          this.requestForm.patchValue(response)
        });
    }

    this.requestForm.get("bankTerminal")?.valueChanges.subscribe(selectedBank => {
      if(selectedBank.swiftCode === "ENATETAA"){
        this.requestForm.get('terminalOwnerBranch')?.setValidators([Validators.required]);
      }
      
   })
  }

  get requestFormFields() {
    return this.requestForm.controls;
  }

  get branchName() {
    return this.requestForm.get('branchName')?.value;
  }

  get bankTerminal() {
    return this.requestForm.get('bankTerminal')?.value;
  }



  getAllBanks() {
    this.bankService
      .getAllBanks(this.pageNumber, this.pageSize)
      .subscribe((response: any) => {
        this.banks = response?._embedded?.bankDtoes;
        this.banksBehaviour.next(this.banks);
        console.log(this.banks, 'banks');
        this.message = response.message;
      });
  }

  setCardInfo() {
    // this.requestForm.patchValue({[requesterName]: this.cardHolder.customername});
    this.requestForm
      .get('cardHolderName')
      ?.patchValue(this.cardHolder[0].customername); // added []
    this.requestForm
      .get('cardNumber')
      ?.patchValue(this.cardHolder[0].atm_CARD_NO);
    this.requestForm
      .get('accountNumber')
      ?.patchValue(this.cardHolder[0].fcc_ACC_NO);
      this.requestForm
      .get('address')
      ?.patchValue(this.cardHolder[0].adress1, this.cardHolder[1].address2);
      this.requestForm
      .get('telephone')
      ?.patchValue(this.cardHolder[0].mobile);
    console.log(this.cardHolder, 'this.cardHolder.customername');
  }

  getCurrentUserRequest() {
    this.currentUserRefundRequest$ =
      this.disputeRequestService.getDisputeRequestByBranchCode(
        this.pageNumber,
        this.pageSize
      );
    console.log(typeof this.user_id, 'tttttttyyyyypeeeeeeeeeeee');
    this.allRequest = this.disputeRequestService
      .getDisputeRequestByBranchCode(this.pageNumber, this.pageSize)
      .subscribe((response:any) => {
        this.allRequest = response;
        console.log(this.allRequest, 'all by current user');

        if (this.allRequest.length > 1) {
          this.new_date = this.allRequest
            .map(function (e: any) {
              return e.createAt;
            })
            .sort()
            .reverse()[0];
          console.log(this.new_date, 'maxDate');
        }
      },
      (error:any)=>{
        this.errorMessage = error.error.errorMessage
      }
      );
  }


  onGetBranches = () =>{
    this.branchService.getBranches().subscribe((res:any)=>{
      this.branches =res?._embedded?.branchDtoes;
    })
  }

  //cardholderInfo
  findByAccountNumber() {
    this.cardHolderService.getCardHoldeInfo(this.pageNumber, this.pageSize, this.accountNumber).subscribe(
      (res: any) => {
        this.cardHolder = res?._embedded?.cardHolderDtoes;
        console.log(res.length)
        if(res.length === 0){
          this._snackBar.open(
            `Card Holder not found with that card Number`,
            ``,
            {
              duration: 2000,
              verticalPosition: 'top',
            }
          );
        }else{ this.setCardInfo();}
      },
      (error:any) => {
        this._snackBar.open(`${error.error.apierror.message}`, 'Error!', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'my-custom-snackbar',
        });
      }
    );
  }

  accountNumberChanged(accountNumber: string) {
    this.accountNumber = accountNumber;
  }

  onSubmitRequest() {
    const requstInformaion = this.requestForm.value;
    const formData = {
      ...requstInformaion,
      user_id: this.user_id,
    };
    console.log(formData, 'form');

    this.disputeRequestService.createDisputeRequest(formData).subscribe(
      (response:any) => {
        this.message = response;
        this._snackBar.open(
          `You request has been successfully submitted!`,
          `Success`,
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition:'right',
            panelClass: 'my-custom-snackbar',
          }
        );
        this.getCurrentUserRequest();
        this.requestForm.reset({
          bankTerminal:'',
          terminalOwnerBranch:''
        });
      },
      (error:any) => {
            this._snackBar.open(`${error.error.apierror.message}`, 'Error!', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'my-custom-snackbar',
            });
      }
    );
  }

  goToHistory() {
    this.router.navigate(['/request/history']);
  }

  onScrollDown = () => {
    this.bankService
      .getAllBanks(this.pageNumber, this.pageNumber + this.pageSize)
      .subscribe(
        (response: any) => {
          this.banks = response?._embedded?.bankDtoes;
          this.banksBehaviour.next(this.banks);
          this.pageNumber += this.pageSize;
        },
        (error: any) => {}
      );
  };

  updateRequest = () => {
    this.disputeRequestService
      .updateDisputeRequest(this.requestId, this.requestForm.value)
      .subscribe(
        (res: any) => {
          this._snackBar.open(`Request has been successfully updated!`, `Success!`, {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: 'my-custom-snackbar',
          });
        //   this.requestForm.get('bankTerminal')?.setValue({
        //     name:null
        //   });
        //   this.requestForm.get('terminalOwnerBranch')?.setValue({
        //     name:null
        //   });
          
        //  this.requestForm.get('bankTerminal')?.setValue({
        //   code:''
        //  }); 
        //  this.requestForm.get('terminalOwnerBranch')?.setValue({
        //   code:''
        //  }); 
         
         this.requestForm.reset({
          bankTerminal:'',
          terminalOwnerBranch:''
        });
        },
        (error: any) => {
          this._snackBar.open(`${error.error.apierror.message}`, `Error!`, {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: 'my-custom-snackbar',
          });
        }
      );
  };

  compareFn(optionOne: any, optionTwo: any): boolean {
    return optionOne.id === optionTwo.id;
  }

  onSubmit = () => {
    if (this.isAddMode) {
      this.onSubmitRequest();
    } else {
      this.updateRequest();
    }
  };
}
