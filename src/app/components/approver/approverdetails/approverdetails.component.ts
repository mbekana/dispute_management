import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from 'src/app/services/comment/comment.service';
import { DisputeMemoService } from 'src/app/services/dispute-memo/dispute-memo.service';

@Component({
  selector: 'app-approverdetails',
  templateUrl: './approverdetails.component.html',
  styleUrls: ['./approverdetails.component.css']
})

export class ApproverdetailsComponent implements OnInit {

  action:string;
  local_data:any;
  requests: any[] = [];
  displayedColumns: string[] = [
    'transactionDate',
    'requesterName',
    'cardNumber',
    'accountNumber',
    'transcationAmount',
  ];


  dataSource = [
    {

    }
  ]

  comments:any[]=[];
  pageNumber: number = 0;
  pageSize: number = 5;
  requestId!:number;
  disputeMemo:any;

  show:boolean=false;
  isInfiniteScrollLoading!:boolean;

  constructor(
    public dialogRef: MatDialogRef<ApproverdetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private commentService:CommentService,
              private disputeMemoService:DisputeMemoService,
              private _snackBar:MatSnackBar
    ) {
    console.log(data.request);
    this.local_data = {...data.request};
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.requests.push(this.data.request);
    this.requestId = this.data.request.id;
    console.log(this.requestId, "requester")
    this.onGetComments();
    this.onGetDisputeMemo(this.requestId);
   
    
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onGetComments = () =>{
    this.commentService.getAllComments(this.data.request?.id, this.pageNumber, this.pageSize).subscribe(res=>{
      this.comments = res?._embedded?.commentDtoes;
    })
  }

  onScrollDown = () => {
    this.isInfiniteScrollLoading = true;
    this.commentService
      .getAllComments(this.data.request?.id, this.pageNumber, ++this.pageSize)
      .subscribe(
        (res: any) => {
            this.comments = res?._embedded?.commentDtoes;
            this.isInfiniteScrollLoading = false;
        },
        (error: any) => {
          this.isInfiniteScrollLoading = false;
        }
      );
  };

  onGetDisputeMemo = (id:number) =>{
    this.disputeMemoService.getDisputeMemoById(id).subscribe((res:any)=>{
      this.disputeMemo = res?._embedded?.disputeMemoDtoes;
      console.log(this.disputeMemo)
    })
  }

  onPrint(){
    window.print();
}

getValue(index:number, type:number){
  // return this.dataSource['attr'+(index+1)+type:];
}

}
