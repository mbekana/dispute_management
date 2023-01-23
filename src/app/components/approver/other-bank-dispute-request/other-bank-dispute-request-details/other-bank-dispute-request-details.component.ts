import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OtherBankDisputeService } from 'src/app/services/other-bank-dispute/other-bank-dispute.service';

@Component({
  selector: 'other-bank-dispute-request-details',
  templateUrl: './other-bank-dispute-request-details.component.html',
  styleUrls: ['./other-bank-dispute-request-details.component.css']
})
export class DirectRequestDetailsComponent implements OnInit {

  panelOpenState = false;
  directRequestId!:number;
  directRequest:any;

  isLoaded:boolean=false;

  constructor(private otherBankDisputeService:OtherBankDisputeService, private activatedRoute:ActivatedRoute) {
    this.directRequestId = Number(this.activatedRoute.snapshot.paramMap.get("id"));
   }

  ngOnInit(): void {
    this.otherBankDisputeService.getDirectRequest(this.directRequestId).subscribe((res:any)=>{
      this.isLoaded = true;
      this.directRequest = res;
      console.log(this.directRequest)
    })
  }

}
