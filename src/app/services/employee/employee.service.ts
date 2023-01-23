import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from 'src/app/models/employee/employee';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }


  getEmployeeByemployeeId(employeeId:string) {
    return this.http.get<Employee>(
      `${environment.HR_HOST}/employees/by-employeeId/${employeeId}`
    );
  }


}
