import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Banks, BanksResponse } from 'src/app/models/banks';
import { BanksService } from 'src/app/services/bank/banks.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {

  bankId!:number;
  banksResponse!:BanksResponse;
  selectedBank!:any;
  panelOpenState = false;


  constructor(private activatedRoute: ActivatedRoute,
              private bankService:BanksService) {}

  ngOnInit(): void {
     this.activatedRoute.params.subscribe((response)=>{
      this.bankId = response.id;
      console.log(this.bankId, "bank Id")
     });

     this.getSelectedBank();
  }

  getSelectedBank(){
    this.bankService.getBankById(this.bankId).subscribe((response:BanksResponse)=>{
      this.banksResponse = response;
      this.selectedBank = response.singleBank;
      console.log(this.selectedBank, "Sele")
    })
  }

}
