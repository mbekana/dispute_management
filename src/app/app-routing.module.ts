import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RequestComponent } from './components/request/request.component';
import { ApproveComponent } from './components/approver/approve/approve.component';

import { Role } from './models/Role';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { BankSummaryComponent } from './components/shared/banks/bank-summary/bank-summary.component';
import { SharedRequestDetailsComponent } from './components/shared/shared-request-details/shared-request-details.component';
import { BankDetailsComponent } from './components/shared/banks/bank-details/bank-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RequestListComponent } from './components/request/request-list/request-list.component';
import { OtherBankDiputeRequest } from './components/approver/other-bank-dispute-request/other-bank-dispute-request.component';
import { CreateOtherBankDisputeRequest } from './components/approver/other-bank-dispute-request/create-other-bank-dispute-request/create-other-bank-dispute-request.component';
import { DirectRequestDetailsComponent } from './components/approver/other-bank-dispute-request/other-bank-dispute-request-details/other-bank-dispute-request-details.component';
import { AssignedRequestsComponent } from './components/request/assigned-requests/assigned-requests.component';
import { AddBanksComponent } from './components/shared/banks/add-banks/add-banks.component';


const routes: Routes = [

  { path: '', component: DashboardComponent },

  {
    path: 'request-refund',
    component: RequestComponent,
  },
  { path: 'request/history', component: RequestListComponent },


  {
    path: 'dispute-requests/on-us',
    component: ApproveComponent,data: {disputeType: 'ENAT_ENAT'}
  },

  {
    path: 'dispute-requests/off-us',
    component: ApproveComponent, data: {disputeType: 'ENAT_ON_OTHER_BANK'}
  },

  {
    path: 'dispute-requests/not-found',
    component: ApproveComponent,data: {disputeType: 'NOT_FOUND_ON_SETTLEMENT'}
  },

  {
    path: 'dispute-requests/acknowledged/approved',
    component: ApproveComponent,data: {disputeType: 'acknowledged', status:'APPROVED'}
  },

  {
    path: 'dispute-requests/acknowledged/settled',
    component: ApproveComponent,data: {disputeType: 'acknowledged', status:'SETTLED'}
  },

  {
    path: 'dispute-requests/acknowledged',
    component: ApproveComponent, data: {isAcknowloedged:true}
  },

  {
    path: 'requests/:id',
    component: SharedRequestDetailsComponent,
  },
  {
    path: 'requests/edit/:id',
    component: RequestComponent,
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'banks-summary',
    component: BankSummaryComponent,
  },
  {
    path: 'banks/:id',
    component: BankDetailsComponent,
  },

  {
    path: 'banks/edit/:id',
    component: AddBanksComponent,
  },

  {
    path: 'bank/register-bank',
    component: AddBanksComponent,
  },

  {
    path: 'direct-requests',
    component: OtherBankDiputeRequest,
  },

  {
    path: 'direct-requests/create',
    component: CreateOtherBankDisputeRequest,
  },

    {
    path: 'direct-requests/details/:id',
    component: DirectRequestDetailsComponent,
  },

  {
    path: 'direct-requests/edit/:id',
    component: CreateOtherBankDisputeRequest,
  },

  {
    path: 'assigned-requests',
    component: AssignedRequestsComponent,
  },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
