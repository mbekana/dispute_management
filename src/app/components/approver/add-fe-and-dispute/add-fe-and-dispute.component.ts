import { DatePipe } from '@angular/common';
import { Component, Inject,  OnInit } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { BranchService } from 'src/app/services/branch/branch.service';
import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';


@Component({
  selector: 'add-fe-and-dispute',
  templateUrl: './add-fe-and-dispute.component.html',
  styleUrls: ['./add-fe-and-dispute.component.css'],
})
export class AddFeAndDisputeIdComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';

  receiveRequestForm: FormGroup;

  declineRequestForm: FormGroup;

  addPayerBranchForm: FormGroup;

  allReq: any;
  selectedRequestId!:number;

  activeUserRole$!:Observable<string>;

  decline:boolean=false;
  payerBranch:boolean = false;
  branchesBehaviour = new BehaviorSubject<any[]>([]);
  branches$: Observable<any[]>;
  branches!:any[];

  pageNumber: number = 0;
  pageSize: number = 10;

  constructor(
    public dialogRef: MatDialogRef<AddFeAndDisputeIdComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private disputeRequestService: DisputeRequestService,
    private oauthService:OAuthService,
    private datePipe: DatePipe,
    private _snackBar:MatSnackBar,
    private branchService:BranchService
  ) {
    this.receiveRequestForm = this.fb.group({
      feNumber: ['',[Validators.required, Validators.minLength(8)]],
      disputeId:  ['', [Validators.required, Validators.minLength(4)]]
    });

    this.declineRequestForm = this.fb.group({
      remark:[null, [Validators.required]],
      status: [null, [Validators.required]]
    })

    this.addPayerBranchForm = this.fb.group({
      payerBranch: [null, [Validators.required]]
    });

    this.branches$ = this.branchesBehaviour.asObservable().pipe(
      scan((acc: any, curr: any) => {
        return [...acc, ...curr];
      }, [])
    );


  }

  ngOnInit(): void {
    // this.activeUserRole$ = this.userService.user_name;
    this.decline = this.data.decline;
    console.log(this.decline)
    this.selectedRequestId = this.data.id;
    this.payerBranch = this.data.payerBranch;
    console.log(this.selectedRequestId)
    this.getSelectedRequest(this.selectedRequestId);
    this.onGetAllBranches();
  }

  get controlsName() {
    return this.receiveRequestForm.controls;
  }

  get declineFormControls() {
    return this.declineRequestForm.controls;
  }

  get payerBranchControls() {
    return this.addPayerBranchForm.controls;
  }

  getSelectedRequest(id:number) {
    this.disputeRequestService.getDisputeRequest(id).subscribe((res: any) => {
      this.allReq = res?._embedded?.disputeRequestDtoes;
    });
  }


  get controlName() {
    return this.receiveRequestForm.controls;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onScrollDown = () => {
    // this.branchService
    //   .getBranches(this.pageNumber, this.pageNumber + this.pageSize)
    //   .subscribe(
    //     (response: any) => {
    //       this.branches = response.content;
    //       this.branchesBehaviour.next(this.branches);
    //       this.pageNumber += this.pageSize;
    //     },
    //     (error: any) => {}
    //   );
  };




  onGetAllBranches = () =>{
    this.branchService.getBranches().subscribe((res:any)=>{
      this.branches = res.content;
      this.branchesBehaviour.next(this.branches);
    })
  }

  onSaveFeAndDisputeNumber = () =>{
    console.log(this.receiveRequestForm.value)
    this.disputeRequestService.receiveDisputeRequest(this.selectedRequestId, this.receiveRequestForm.value).subscribe(res=>{
      this._snackBar.open(
        `You have successfully received request ${this.selectedRequestId}`,
        `Success!`,{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        }
      )
      this.receiveRequestForm.reset();
      this.dialogRef.close();
      
    },
    (error:any)=>{
      this._snackBar.open(
        `${error.error.message}`,
        `Error`,{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        }
      )
    }
    )
  }

  onDeclineRequest = () =>{
    this.disputeRequestService.declineRequest(this.selectedRequestId, this.declineRequestForm.value).subscribe(
      (res:any) => {
        this._snackBar.open(
          `Successfully Declined request ${this.selectedRequestId}`,
          'Success!',
          {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'my-custom-snackbar',
          }
        );
        this.getSelectedRequest(this.selectedRequestId);
      },
      (error: any) => {
        this._snackBar.open(
          `${error.error.message}`,
          'Error!',
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


  public get userName() {
    const cliams = this.oauthService.getIdentityClaims();
    if (!cliams) { return null; }

    return (cliams as any).given_name;
  }


}

