import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BranchService } from 'src/app/services/branch/branch.service';
import { DisputeMemoService } from 'src/app/services/dispute-memo/dispute-memo.service';
import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';
// import { scan } from 'rxjs/operators';


@Component({
  selector: 'app-dispute-memo',
  templateUrl: './dispute-memo.component.html',
  styleUrls: ['./dispute-memo.component.css'],
})
export class DisputeMemoComponent implements OnInit {
  disputeMemoForm!: FormGroup;
  requestId!: number;
  memeoId!:number;


  // branchesBehaviour = new BehaviorSubject<any[]>([]);
  // branches$: Observable<any[]>;
  branches!:any[];

  pageNumber: number = 0;
  pageSize: number = 10;

  isAddMode!:boolean;

  disputeMemo:any;



  constructor(
    private fb: FormBuilder,
    private disputeMemoService: DisputeMemoService,
    public dialogRef: MatDialogRef<DisputeMemoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private branchService:BranchService,
    private disputeRequestService:DisputeRequestService
  ) {
    this.disputeMemoForm = this.fb.group({
      failedMachineName: [null, [Validators.required]],
      cashOnATM: [null,[Validators.required]],
      networkSuspenseGl: [null, [Validators.required]],
      networkSuspenseGl2: [null, [Validators.required]],
      atmCashWithdrawalFee: [null, [Validators.required]],
      payerBranch:[null, [Validators.required]],
      creditCustomersAC:[null, [Validators.required]]
    });


    // this.branches$ = this.branchesBehaviour.asObservable().pipe(
    //   scan((acc: any, curr: any) => {
    //     return [...acc, ...curr];
    //   }, [])
    // );

  }

  ngOnInit(): void {
    
    this.requestId = this.data?.id?.id;
    console.log(this.requestId)
    this.onGetBranches();
    
    this.isAddMode = !this.data?.id?.disputeMemo?.id
    this.memeoId = this.data?.id?.disputeMemo?.id
    this.disputeMemo = this.data?.id?.disputeMemo
    console.log(this.isAddMode)

    if(!this.isAddMode){
      this.disputeMemoForm.patchValue(this.disputeMemo)
    }
  }

  get controlName() {
    return this.disputeMemoForm.controls;
  }



  onGetBranches = () =>{
    this.branchService.getBranches().subscribe((res:any)=>{
      this.branches =res?._embedded?.branchDtoes;
      console.log(this.branches)
    })
  }

  compareFn(optionOne: any, optionTwo: any): boolean {
    return optionOne.id === optionTwo.id;
  }

  compareBranch(optionOne: any, optionTwo: any): boolean {
    return optionOne.branch?.code === optionTwo.payerBranch;
  }
  onCreateDisputeMemo = () => {
    const data = {
      failedMachineName:this.disputeMemoForm.get('failedMachineName')?.value,
      cashOnATM:this.disputeMemoForm.get('cashOnATM')?.value,
      networkSuspenseGl:this.disputeMemoForm.get('networkSuspenseGl')?.value,
      creditCustomersAC:this.disputeMemoForm.get('creditCustomersAC')?.value,
      atmCashWithdrawalFee:this.disputeMemoForm.get('atmCashWithdrawalFee')?.value,
      networkSuspenseGl2:this.disputeMemoForm.get('networkSuspenseGl2')?.value,
      payerBranch: this.disputeMemoForm.get('payerBranch')?.value?.code,
      payerBranchName: this.disputeMemoForm.get('payerBranch')?.value?.name
    }
    this.disputeMemoService
      .createDisputeMemo(this.requestId, data)
      .subscribe(
        (res: any) => {
          this._snackBar.open(
            'You have successfully Added Dispute Memo!',
            'Success',
            {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'my-custom-snackbar',
            }
          );
          this.disputeMemoForm.reset({
            payerBranch : ""
          })

          setTimeout(() => {
            this.dialogRef.close()
          }, 1000);
        },
        (error: any) => {
          this._snackBar.open(
            `${error.error.message}!`,
            'Error',
            {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'my-custom-snackbar',
            }
          );
        }
      );
  };


  onUpdateDisputeMemo = () =>{
    const data = {
      failedMachineName:this.disputeMemoForm.get('failedMachineName')?.value,
      cashOnATM:this.disputeMemoForm.get('cashOnATM')?.value,
      networkSuspenseGl:this.disputeMemoForm.get('networkSuspenseGl')?.value,
      creditCustomersAC:this.disputeMemoForm.get('creditCustomersAC')?.value,
      atmCashWithdrawalFee:this.disputeMemoForm.get('atmCashWithdrawalFee')?.value,
      networkSuspenseGl2:this.disputeMemoForm.get('networkSuspenseGl2')?.value,
      payerBranch: this.disputeMemoForm.get('payerBranch')?.value?.code,
      payerBranchName: this.disputeMemoForm.get('payerBranch')?.value?.name
    }
    console.log(data)
    this.disputeMemoService
      .updateDisputeMemo(this.memeoId,  data)
      .subscribe(
        (res: any) => {
          this._snackBar.open(
            'You have successfully updated Dispute Memo!',
            'Success',
            {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'my-custom-snackbar',
            }
          );
          this.disputeMemoForm.reset({
            payerBranch : ""
          })

          setTimeout(() => {
            this.dialogRef.close()
          }, 1000);
        },
        (error: any) => {
          this._snackBar.open(
            `${error.error.message}!`,
            'Error',
            {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'my-custom-snackbar',
            }
          );
        }
      ); 
  }


  onSubmitMemo = () =>{
    if(this.isAddMode){
      this.onCreateDisputeMemo();
    }else{
      this.onUpdateDisputeMemo()
    }
  }




}
