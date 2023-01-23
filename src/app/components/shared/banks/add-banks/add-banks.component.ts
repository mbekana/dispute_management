import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { BanksResponse } from 'src/app/models/banks';
import { BanksService } from 'src/app/services/bank/banks.service';

@Component({
  selector: 'app-add-banks',
  templateUrl: './add-banks.component.html',
  styleUrls: ['./add-banks.component.css']
})
export class AddBanksComponent implements OnInit {

  addBankForm!:UntypedFormGroup;

  message!:BanksResponse;

  public validationStyle = {
    color: 'red',
    fontWeight: '400',
    marginTop: '-0.5em',
    marginBottom: '1em',
    marginLeft:'0em'
  };

  isAddMode!:boolean;
  bankId!:number;

  isLoading!:boolean;

  constructor(private fb:UntypedFormBuilder,
              private bankService: BanksService,
              private activatedRoute:ActivatedRoute,
              private _snackBar:MatSnackBar) { 
                this.bankId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.addBankForm = this.fb.group({
       name: ['', [Validators.required, Validators.minLength(5)]],
       swiftCode: ['', [Validators.required, Validators.minLength(5)]]
    })    
  }



  ngOnInit(): void {
    this.isAddMode = !this.bankId;

    if (!this.isAddMode) {
      this.isLoading=true;
      this.bankService
        .getBankById(this.bankId)
        .pipe(first())
        .subscribe((response: any) =>{
          this.isLoading = false;
          this.addBankForm.patchValue(response)
        });
  }
}


  get fields(){
    return this.addBankForm.controls;
  }


  registerBank () {
    this.bankService.createBank(this.addBankForm.value).subscribe((response)=>{
      this.message = response.message;
      this._snackBar.open(`You have successfully added bank ${this.addBankForm.get('name')?.value}`, `Close`,
      { duration:3000, 
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass:"success-class"
      }
      )
      this.addBankForm.reset();
    },
    
    (error:any)=>{
      const config = new MatSnackBarConfig();
      this._snackBar.open(`${error.error.apierror.message}`, `Close`,
      { duration:3000, 
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass:"error-class"
      }
      )
    })
  }

  editBank(){ 
    this.bankService.updateBank(this.bankId, this.addBankForm.value).subscribe((response:BanksResponse)=>{
      this._snackBar.open(`You have successfully updated bank ${this.addBankForm.value?.name}`, `Close`,
      { duration:3000, 
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass:"success-class"
      }
      ),
      this.addBankForm.reset();
    },
  
    (error:any) =>{ 
       this._snackBar.open(`${error.error.apierror.message}`, `Close`,
       { duration:3000, 
         horizontalPosition:'right',
         verticalPosition:'top',
         panelClass:"error-class"
       }
       )
     },
    
      )
  }

  submit(){
      if (this.isAddMode) {
        this.registerBank();
      } else {
        this.editBank();
      }

  }



}
