import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Banks, BanksResponse } from 'src/app/models/banks';
import { BanksService } from 'src/app/services/bank/banks.service';

import { AddBanksComponent } from '../add-banks/add-banks.component';

@Component({
  selector: 'app-bank-summary',
  templateUrl: './bank-summary.component.html',
  styleUrls: ['./bank-summary.component.css']
})
export class BankSummaryComponent implements OnInit {

  displayedColumns = ['id', 'swiftCode', 'name', 'createdBy', 'updatedBy' ,'edit', 'details', 'delete'];
  public dataSource = new MatTableDataSource<Banks>();
  
  selectedRow!:any;

  isLoaded:boolean = false;

  message!:string | undefined;
  banks:any [] = [];
  // banksData:Banks [] = [];
  index!: number;
  id!: number;

  bankResponse!:BanksResponse;
  selectedBank!:any;
  total:number=0;

  searchBankForm!:FormGroup;



  editBankForm!:UntypedFormGroup;
  
  isAddMode!: boolean;

  public validationStyle = {
    color: 'red',
    fontWeight: '400',
    marginTop: '-0.5em',
    marginBottom: '1em',
    marginLeft:'0em'
  };

  // page infor
  pageSize:number=10;
  pageNumber :number=0;

  searchFormVisible:boolean=false;

  loading!:boolean;
  params:any[]=[];
  parameter!: string;

  constructor(private bankService:BanksService,
              public dialog: MatDialog,
              private fb:UntypedFormBuilder,
              private _snackBar:MatSnackBar,
              private router:Router) {

              this.editBankForm = this.fb.group({
                  name: ['', [Validators.required, Validators.minLength(5)]],
                  swiftCode: ['', [Validators.required, Validators.minLength(5)]]
               })   

            this.searchBankForm = this.fb.group({
                  name: ['', [Validators.required, Validators.minLength(5)]],
                  swiftCode: ['', [Validators.required, Validators.minLength(5)]]
               })   


              }

  ngOnInit(): void {
    
    this.retrieveBanks();
  }
  
  retrieveBanks(){
    this.bankService.getAllBanks(this.pageNumber, this.pageSize).subscribe((data:any)=> { 
        this.banks = data?._embedded?.bankDtoes;
        this.isLoaded = true;
    },
    (err:any)=>{
      this.message = err.error.message;
      this.isLoaded = false;
      console.log(this.message);
    }
    )
  }



  getRow(element:any){
     this.selectedRow = element;
  }

  getAndPatch(element:any){
    this.selectedRow = element;
    this.editBankForm.patchValue({
     name: this.selectedRow?.name,
     swiftCode:this.selectedRow?.swiftCode
   })
 }

  navigateDetails(){
   this.router.navigate(["/branch-details/", this.selectedRow.id])
 }

  get fields(){
    return this.editBankForm.controls;
  }


applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}


openDialog(action:string,obj:any) {
  obj.action = action;
  const dialogRef = this.dialog.open(AddBanksComponent, {
    width: '400px',
    height:'350px',
    data:obj,
    position: {bottom: '0%', right:'0%'}
  }).afterClosed()
    .subscribe(()=> this.retrieveBanks());
}

deleteBank(id:number){
  this.bankService.deleteBank(id).subscribe((response:BanksResponse)=>{
    this.message = response.message;
    this._snackBar.open(
      `${this.message}`,
      `Success!`,
    { duration:3000, 
      horizontalPosition:'right',
      verticalPosition:'top',
      panelClass:"success-class"
    })
      this.retrieveBanks();
  },
  
  error =>{ 
        
    this._snackBar.open(`${error.error.apierror.message}`, `Close`,
    { duration:3000, 
      horizontalPosition:'right',
      verticalPosition:'top',
      panelClass:"error-class"
    }
    )
  }
  
  )
}




onNavigateToEdit = (id:number) =>{
  this.router.navigate(["/banks/edit/", id])
}


bankDetails(id:number){ 
  this.router.navigate(['/banks', id])
}


pageChanged = (event: PageEvent) =>{
  console.log({ event });
  this.pageSize = event.pageSize;
  this.pageNumber = event.pageIndex;
  this.bankService.getAllBanks(this.pageNumber, this.pageSize).subscribe((res:any)=>{
    this.banks = res?._embedded?.bankDtoes;
  });
}

onToggleAdvancedSearch = () =>{
  this.searchFormVisible = !this.searchFormVisible;
}


onSearchBranch(){
  this.loading = true;

    this.params = [];
    Object.keys(this.searchBankForm.controls).forEach((key: string) => {
      if ((<any>this.searchBankForm.get(key)).value) {
        if (key.indexOf('name') > -1) {
          this.params.push([`name:'*${this.searchBankForm.get('name')?.value}*'`
]);
        } else if (key.indexOf('cardNumber') > -1) {
          this.params.push([
            `cardNumber:${this.searchBankForm.get('swiftCode')?.value}`,
          ]);
        } 
      }});

    this.parameter = this.params.join(' AND ');
    console.log(this.parameter);
    this.bankService.searchBanks(this.parameter).subscribe(
      (res:any) => {
        
          this.loading = false;
          this.banks = res?._embedded?.bankDtoes;
      
      },
      (error:any) => {
        this.loading = false;
      }
    );
}

registerBank() {
  this.router.navigate(['/bank/register-bank']);
}


}
