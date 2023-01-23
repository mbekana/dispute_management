import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentService } from 'src/app/services/comment/comment.service';
import { DisputeMemoService } from 'src/app/services/dispute-memo/dispute-memo.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-archive-document',
  templateUrl: './archive-document.component.html',
  styleUrls: ['./archive-document.component.css']
})
export class ArchiveDocumentComponent implements OnInit {

  dataFromComponent!:any;

  comments:any[]=[];
  pageNumber: number = 0;
  pageSize: number = 5;

  requests: any[] = [];
  miscellaneousData:any;
  // private userService:UserService, 
  constructor(public dialogRef: MatDialogRef<ArchiveDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commentService:CommentService,
    private disputeMemoService:DisputeMemoService
    ) { }

  ngOnInit(): void {
    this.dataFromComponent = this.data.request;
    console.log(this.dataFromComponent, "from component")
    this.requests.push(this.data.request);
    this.onGetComments();
    this.onGetMiscellaneousData(this.dataFromComponent?.id);
    console.log(this.onGetMiscellaneousData(this.dataFromComponent?.id))
  }


  // getRoles() {
  //   for (let i = 0; i < this.userService.getUser().roles.length; i++) {
  //     return this.userService.getUser().roles[i];
  //   }
  // }

  onGetComments = () =>{
    this.commentService.getAllComments(this.data.request?.id, this.pageNumber, this.pageSize).subscribe(res=>{
      this.comments = res.content;
    })
  }


  onScrollDown = () => {
    // this.isInfiniteScrollLoading = true;
    this.commentService
      .getAllComments(this.data.request?.id, this.pageNumber, ++this.pageSize)
      .subscribe(
        (res: any) => {
            this.comments = res.content;
            // this.isInfiniteScrollLoading = false;
        },
        (error: any) => {
          // this.isInfiniteScrollLoading = false;
        }
      );
  };


  onGetMiscellaneousData = (id:number) =>{
    this.disputeMemoService.getDisputeMemoById(id).subscribe((res:any)=>{
      this.miscellaneousData = res;
    })
  }


  onPrint(){
    window.print();
}
}
