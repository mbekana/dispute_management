import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NumericValueType,
  RxwebValidators,
} from '@rxweb/reactive-form-validators';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { BanksService } from 'src/app/services/bank/banks.service';
import { OtherBankDisputeService } from 'src/app/services/other-bank-dispute/other-bank-dispute.service';
import { scan } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'create-other-bank-dispute-request',
  templateUrl: './create-other-bank-dispute-request.component.html',
  styleUrls: ['./create-other-bank-dispute-request.component.css'],
})
export class CreateOtherBankDisputeRequest implements OnInit {
  otherBankDisputeForm!: FormGroup;
  banks!: any[];

  // pageInfo
  pageNumber: number = 0;
  pageSize: number = 10;

  options = new BehaviorSubject<any[]>([]);
  options$: Observable<any[]>;

  isAddMode!: boolean;

  requestId!: number;

  constructor(
    private fb: FormBuilder,
    private bankService: BanksService,
    private otherBankDisputeService: OtherBankDisputeService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.requestId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.options$ = this.options.asObservable().pipe(
      scan((acc: any, curr: any) => {
        return [...acc, ...curr];
      }, [])
    );

    this.otherBankDisputeForm = this.fb.group({
      cardNumber: [null],
      issuerBank: [null],
      acquirerBank: [null],
      amount: [null],
      transactionDate: [null],
      ejStatus: [null],
      terminalId: [null],
      feNumber: [null],
      disputeId: [null],
    });
  }

  ngOnInit(): void {
    this.isAddMode = !this.requestId;
    this.getAllBanks();

    if (!this.isAddMode) {
      this.otherBankDisputeService
        .getDirectRequest(this.requestId)
        .pipe(first())
        .subscribe((response: any) => this.otherBankDisputeForm.patchValue(response));
    }
  }

  getAllBanks() {
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

  submitRequest = () => {
    console.log(this.otherBankDisputeForm.value);
  };

  onSubmitDirectRequest = () => {
    this.otherBankDisputeService
      .createDirectRequest(this.otherBankDisputeForm.value)
      .subscribe(
        (res) => {
          this._snackBar.open(
            `You have successfully created request`,
            `Success!`
          );
          console.log(res);
          this.otherBankDisputeForm.reset();
        },
        (error: any) => {
          this._snackBar.open(`${error.error.message}`, `Error`);
        }
      );
  };

  compareFn(optionOne: any, optionTwo: any): boolean {
    return optionOne.id === optionTwo.id;
  }

  updateDirectRequest = () => {
    this.otherBankDisputeService
      .updateDirectRequest(this.requestId, this.otherBankDisputeForm.value)
      .subscribe(
        (res: any) => {
          this._snackBar.open(
            `You have successfully updated request ${this.requestId}`,
            `Success!`,
            {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'my-custom-snackbar',
            }
          );
          this.otherBankDisputeForm.reset({
            issuerBank:'',
            acquirerBank:''
          })
        },
        (error: any) => {
          this._snackBar.open(`${error.error.message}`, `Error`, {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'my-custom-snackbar',
          });
        }
      );
  };

  onSubmit = () => {
    if (this.isAddMode) {
      this.onSubmitDirectRequest();
    } else {
      this.updateDirectRequest();
    }
  };
}
