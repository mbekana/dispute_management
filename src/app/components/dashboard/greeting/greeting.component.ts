import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.css']
})
export class GreetingComponent implements OnInit {

  branchName:string='';
  branchCode:string='';

  constructor(private authService:AuthService, private oauthService:OAuthService,private employeeService:EmployeeService) { }

  ngOnInit(): void {
    this.getEmployee();
  }


  public get fullName()
  {
    return (<any>this.authService.getTokenDetails()).name;
  }

  public get userName() {
    const cliams = this.oauthService.getIdentityClaims();
    if (!cliams) { return null; }

    return (cliams as any).given_name;
  }

  getEmployee() {
    const employeeId = this.authService.getEmployeeId();
    this.employeeService
      .getEmployeeByemployeeId(employeeId)
      .subscribe((data:any) => {
        this.branchName = data.branch.name;
        this.branchCode = data.branch.code;
      });
  }

}
