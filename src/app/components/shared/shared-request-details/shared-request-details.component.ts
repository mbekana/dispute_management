import { NumberInput } from '@angular/cdk/coercion';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Branch } from 'src/app/models/branch';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BranchService } from 'src/app/services/branch/branch.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { DisputeRequestService } from 'src/app/services/dispute-request/dispute-request.service';
import { EjService } from 'src/app/services/ej/ej-service';
// import { UserService } from 'src/app/services/user.service';
import { AddFeAndDisputeIdComponent } from '../../approver/add-fe-and-dispute/add-fe-and-dispute.component';
import { ApproverdetailsComponent } from '../../approver/approverdetails/approverdetails.component';
import { DisputeMemoComponent } from '../../approver/dispute-memo/dispute-memo.component';
import { ArchiveDocumentComponent } from '../print/archive-document/archive-document.component';

@Component({
  selector: 'app-shared-request-details',
  templateUrl: './shared-request-details.component.html',
  styleUrls: ['./shared-request-details.component.css'],
})
export class SharedRequestDetailsComponent implements OnInit {
  @ViewChild('fileDropRef', { static: false }) fileDropEl!: ElementRef;
  requestId: any;
  requesterDetails!: any;
  memoFileName: any;
  ejFileName: any;

  // netImage: any = '../../../../assets/pdf.png';

  isCheckedAsOtherBanks: boolean = false;
  sameTerminal: boolean = false;

  uploadMemoForm!: UntypedFormGroup;
  uploadEjForm!: UntypedFormGroup;

  url!: any;

  requests: any[] = [];
  displayedColumns: string[] = [
    'id',
    'createdBy',
    'approvedBy',
    'telephone',
    'transcationAmount',
  ];

  memoImageSrc: string = '';
  ejImageSrc: string = '';
  branch: Branch[] = [];
  filteredOptions!: Observable<Branch[]>;

  imageFile!: File;
  selectedEjFiles!: FileList;
  currentEjFile!: File;

  selectedMemoFiles!: FileList;
  currentMemoFile!: File;
  message!: string;

  username!: string;
  role: any;

  file: any;
  ejFile:any;

  file_type: any;

  commentForm!: UntypedFormGroup;

  settlemntDateForm!:FormGroup;

  // data loaded
  isLoaded: boolean = false;

  // commet pannel
  panelOpenState = false;
  comments: any[] = [];
  replying: boolean = false;

  commentCount: number = 0;

  // pagination
  pageNumber: number = 0;
  pageSize: number = 5;

  totalElements:number=0;

  // infinite scroll
  sum = 100;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  modalOpen = false;
  isInfiniteScrollLoading: boolean = false;
  payerBranchMemo: any;
  payerBranchEj: any;
  accessRoles: any;
 employeeId:any;

 public commentCount$ = new BehaviorSubject<number>(0);

 @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;
  constructor(
    private activatedRoute: ActivatedRoute,
    private disputeRequestService: DisputeRequestService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private branchService: BranchService,
    private router: Router,
    private dialog: MatDialog,
    private ejService:EjService,
    private commentService: CommentService,
    private authService:AuthService
  ) {
    this.commentForm = fb.group({
      content: ['', [Validators.required]],
      // senderId: [this.username],
    });

    this.settlemntDateForm = this.fb.group({
      settlementDate:[null, [Validators.required]]
    })

    this.uploadEjForm = this.fb.group({
      branchName: ['', [Validators.required]],
      fileName: ['', [Validators.required]],
      fileSource: ['', [Validators.required]],
      ejImageSrc: ['', [Validators.required]],
    });
  }


  get replyControls() {
    return this.commentForm.get('replies') as UntypedFormArray;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((response) => {
      this.requestId = response['id'];
    });
    this.getRoles();
    this.getDisputeRequest();
    this.getAllBranches();

    this.onGetAllComments();
    this.employeeId = this.authService.getEmployeeId();
  }



  getDisputeRequest() {
    this.disputeRequestService.getDisputeRequest(this.requestId).subscribe(
      (response: any) => {
        this.isLoaded = true;
        this.requesterDetails = response;
        console.log(this.requesterDetails, 'reqDe');
        this.requests.push(this.requesterDetails);
        console.log(this.requests, 'response');
      },
      (error: any) => {
        console.log(error);
        this.isLoaded = false;
      }
    );
  }

  getAllBranches() {
    this.branchService.getBranches().subscribe((response: any) => {
      this.branch = response?._embedded?.branchDtoes;
      for (let i = 0; i < this.branch.length; i++) {}
    });
  }


  onMarkAsNoSettlementDocument = () => {
    this.disputeRequestService.markDisputeRequestAsNotFound(this.requestId).subscribe(
      (res:any) => {
        this._snackBar.open(
          'Request has been marked as not found on settlement document!',
          'Success',
          {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'my-custom-snackbar',
          }
        );
        this.getDisputeRequest();
      },
      (error: any) => {
        console.log(console);
        this._snackBar.open(`${error.error.message}`, 'Error!', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'my-custom-snackbar',
        });
      }
    );
  };

  // upoad Ej
  onUploadAtmElectronicJournal() {
    const file = this.ejFile;
    this.ejService
      .uploadAtmElectronicJournal(
        file,
        this.requestId,
        'Atm Electronic Journal'
      )
      .subscribe((response: any) => {
        this.message = String(response.message);
        this._snackBar.open(`You have successfully uploaded Ej File`, 'Done', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'my-custom-snackbar',
        });
        this.fileDropEl.nativeElement.value = "";
      },
      (error:any)=>{
        this._snackBar.open(`${error.error.message}`, 'Error', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'my-custom-snackbar',
        });
      }

      );
  }

  // findRole
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


  prepareFile(file: any) {
    // for (const item of files) {
    this.file = file.item(0)!;
    file.progress = 0;

    // this.files.push(item);
    // }
    this.fileDropEl.nativeElement.value = '';
    this.uploadFilesSimulator(0);
  }

  prepareEjFile(ejFile: any) {
    // for (const item of files) {
    this.ejFile = ejFile.item(0)!;
    ejFile.progress = 0;

    // this.files.push(item);
    // }
    this.fileDropEl.nativeElement.value = '';
    this.uploadFilesSimulator(0);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      const progressInterval = setInterval(() => {
        if (this.file.progress === 100) {
          clearInterval(progressInterval);
          this.uploadFilesSimulator(index);
        } else {
          this.file.progress += 5;
        }
      }, 200);
    }, 2000);
  }

  onFileDropped($event: any) {
    this.prepareFile($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event: any) {
    this.file = event.target.files.item(0)!;
    this.prepareFile(this.file);
  }

  onEjFileDropped($event: any) {
    this.prepareEjFile($event);
  }

  ejFileBrowseHandler(event: any) {
    this.ejFile = event.target.files.item(0)!;
    this.prepareFile(this.ejFile);
  }

  deleteFile() {
    this.file;
    console.log(this.file, 'mukera');
  }



  formatBytes(bytes: any, decimals: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }




  openEjFileOnNewTab = () => {
      this.ejService.downloadEj(this.requestId).subscribe((res:any)=>{
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
  };


  onDecideReceive = (requestType: string) => {
    if (
      requestType === 'ENAT_ENAT' ||
      requestType === 'NOT_FOUND_ON_SETTLEMENT' ||
      requestType === 'OTHER_BANK_ON_ENAT'
    ) {
      const data = {
        feNumber: null,
        disputeId: null,
      };
      this.onReceiveRequest(data);
    } else {
      this.openReceiveComponent();
    }
  };


  // Receive Request
  onReceiveRequest(data:any) {
    this.disputeRequestService
      .receiveDisputeRequest(this.requestId, data)
      .subscribe((response: any) => {
        this._snackBar.open(`Request has been reveived!`, 'Received', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'my-custom-snackbar',
        });

        this.getDisputeRequest();
      });
  }

// Open Receive component
  openReceiveComponent(): void {
    const dialogRef = this.dialog.open(AddFeAndDisputeIdComponent, {
      width: '350px',
      panelClass: 'margin-top:3em',
      data: { id: this.requestId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getDisputeRequest();
    });
  }

  createComment(id: number) {
    this.commentService
      .createComment(id, this.commentForm.value)
      .subscribe((res) => {
        console.log(this.commentForm.value, 'form value');
        this.commentForm.reset();
        this.onGetAllComments();
      });
  }

  onGetAllComments = (pageNumber?:number, pageSize?:number) => {
    this.commentService
      .getAllComments(this.requestId, this.pageNumber, this.pageSize)
      .subscribe((res) => {
        this.comments = res?._embedded?.commentDtoes;
        this.totalElements = res.page.totalElements;
        console.log(this.comments)
        this.comments.forEach((el) => {
          if (el.status === 'sent') {
            this.commentCount += 1;
          }
          this.commentCount$.next(this.commentCount);
        });
        console.log(this.commentCount);
      });
  };

  onReplyingToComment = () => {
    this.replying = true;
  };

  onDeclineRequest = () => {
    const dialogRef = this.dialog.open(AddFeAndDisputeIdComponent, {
      width: '350px',
      panelClass: 'margin-top:3em',
      data: { id: this.requestId , decline:true},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getDisputeRequest();
    });
  };

  onReadMessage = (id: number) => {
    // console.log(this.)
    this.comments.forEach((element) => {
      console.log(element.senderId?.employeeId === this.employeeId);
      if (
        element?.status === 'sent' &&
        element.senderId?.employeeId === this.employeeId
      ) {
        return;
      } else {
        this.commentService.readComment(id).subscribe((res:any) => {
          this.onGetAllComments(this.pageNumber, this.pageSize);
        });
      }
    });
  };

  onScrollDown = () => {
    this.isInfiniteScrollLoading = true;
    this.commentService
      .getAllComments(this.requestId, this.pageNumber, ++this.pageSize)
      .subscribe(
        (res: any) => {
          this.comments = res.content;
          this.isInfiniteScrollLoading = false;
        },
        (error: any) => {
          this.isInfiniteScrollLoading = false;
        }
      );
  };

  onAcknowledgeRequest = () => {
    const data = {
      settlementDate : this.settlemntDateForm.get('settlementDate')?.value
    }
    this.disputeRequestService.acknowledgeDisputeRequest(this.requestId, data).subscribe(
      (res) => {
        this._snackBar.open(
          `Successfully Acknowledged request ${this.requestId}`,
          'Success!',
          {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'my-custom-snackbar',
          }
        );
        this.getDisputeRequest();
        this.settlemntDateForm.reset();
        this.menu.closeMenu();
      },
      (error: any) => {
        this._snackBar.open(`${error.error.apierror.message}`, 'Error!', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'my-custom-snackbar',
        });
      }
    );
  };

  openApproverDetails = () => {
    const dialogRef = this.dialog.open(ApproverdetailsComponent, {
      width: '800px',
      panelClass: 'approver-details',
      data: { request: this.requesterDetails },
      position: {
        top: '0',
        left: '0',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getDisputeRequest();
    });
  };


  onAddMiscellaneous = () => {
    const dialogRef = this.dialog.open(DisputeMemoComponent, {
      width: '600px',
      data: { id: this.requesterDetails },
      position: {
        top: '240px',
        left: '570px',
      },
    });
  };

  onOPenPrint = () =>{
    const dialogRef = this.dialog.open(ArchiveDocumentComponent, {
      width: '800px',
      panelClass: 'approver-details',
      data: { request: this.requesterDetails },
      position: {
        top: '0',
        left: '0',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  onApproveRequest = (id:number) =>{
    this.disputeRequestService.approveDisputeRequest(id).subscribe((res:any)=>{
      this._snackBar.open(
        `Successfully Approved request ${this.requestId}`,
        'Success!',
        {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'my-custom-snackbar',
        }
      );
      this.getDisputeRequest();
    })
  }

  onMarkAsSettledRequest = () =>{
    this.disputeRequestService.markDisputeRequestAsNotFound(this.requestId).subscribe((res:any)=>{
      this._snackBar.open(
        `You have successfully Approved request ${this.requestId}`,
        'Success!',
        {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'my-custom-snackbar',
        }
      );
      this.getDisputeRequest();
    },
    (error:any)=>{
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
    )
  }


  onAddPayerBranch = () =>{
    const dialogRef = this.dialog.open(AddFeAndDisputeIdComponent, {
      width: '350px',
      panelClass: 'margin-top:3em',
      data: { id: this.requestId , payerBranch:true},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getDisputeRequest();
    }); 
  }


  preventPropagation($event:any){
    $event.stopPropagation();
    //Another instructions
}



onConfirmSettlement = (id:number) =>{
  this.disputeRequestService.confirmSettlement(id).subscribe((res:any)=>{
    this._snackBar.open(
      `Successfully Approved request ${this.requestId}`,
      'Success!',
      {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'my-custom-snackbar',
      }
    );
    this.getDisputeRequest();
  },
  (error:any)=>{
    this._snackBar.open(`${error.error.apierror.message}`, 'Error!', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'my-custom-snackbar',
    });
  }
  )
}


}
