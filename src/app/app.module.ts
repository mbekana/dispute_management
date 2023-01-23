import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { DatePipe } from '@angular/common';
// import { LoginComponent } from './components/user/login/login.component';

import { AppHttpInterceptor } from './AppHttpInterceptor';
// import { UserListComponent } from './components/user/user-list/user-list.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SignupComponent } from './components/user/signup/signup.component';
// import { HomePageComponent } from './components/shared/home-page/home-page.component';
// import { ProfileComponent } from './components/user/profile/profile.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { RequestComponent } from './components/request/request.component';

import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatGridListModule} from '@angular/material/grid-list'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ChartsModule } from 'ng2-charts';
import {MatProgressBarModule} from '@angular/material/progress-bar';

// import { NotAuthGuard } from './guard/not-auth.guard';
import { ApproveComponent } from './components/approver/approve/approve.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { HeaderComponent } from './components/shared/header/header.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './services/auth/auth.service';
import { RequestListComponent } from './components/request/request-list/request-list.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ApproverdetailsComponent } from './components/approver/approverdetails/approverdetails.component';
// import { PasswordResetComponent } from './components/user/password-reset/password-reset.component';
// import { AutoLogoutService } from './services/auto-logout.service';
import { AddFeAndDisputeIdComponent } from './components/approver/add-fe-and-dispute/add-fe-and-dispute.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {NgxPrintModule} from 'ngx-print';
import {MatCheckboxModule} from '@angular/material/checkbox'; 

import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';

import { OAuthModule } from "angular-oauth2-oidc";
import { CreditCardMaskPipe } from './models/utils/credit-card-mask.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BankSummaryComponent } from './components/shared/banks/bank-summary/bank-summary.component';
import { SharedRequestDetailsComponent } from './components/shared/shared-request-details/shared-request-details.component';
import { AddBanksComponent } from './components/shared/banks/add-banks/add-banks.component';
import { BankDetailsComponent } from './components/shared/banks/bank-details/bank-details.component';
import { DndDirective } from './dnd-directive';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { CardComponent } from './components/dashboard/card/card.component';
import { PieChartComponent } from './components/dashboard/charts/pie-chart/pie-chart.component';
import { DisputeMemoComponent } from './components/approver/dispute-memo/dispute-memo.component';
import { ArchiveDocumentComponent } from './components/shared/print/archive-document/archive-document.component';
import { NewRequestsComponent } from './components/dashboard/table/new-requests.component';
import {  OtherBankDiputeRequest } from './components/approver/other-bank-dispute-request/other-bank-dispute-request.component';
import { CreateOtherBankDisputeRequest } from './components/approver/other-bank-dispute-request/create-other-bank-dispute-request/create-other-bank-dispute-request.component';
import { DirectRequestDetailsComponent } from './components/approver/other-bank-dispute-request/other-bank-dispute-request-details/other-bank-dispute-request-details.component';
import { ErrorPageComponent } from './components/shared/error-page-handler/error-page/error-page.component';
import { KeycloakAngularModule } from 'keycloak-angular';
import { TipAboutRequestsComponent } from './components/shared/tip-about-requests/tip-about-requests.component';
import { AssignedRequestsComponent } from './components/request/assigned-requests/assigned-requests.component';
import { LinksComponent } from './components/dashboard/links/links.component';
import { GreetingComponent } from './components/dashboard/greeting/greeting.component';



@NgModule({
  declarations: [
    AppComponent,
    CreditCardMaskPipe,
    RequestComponent,
    ApproveComponent,
    NotFoundComponent,
    HeaderComponent,
    RequestListComponent,
    ApproverdetailsComponent,
    BankSummaryComponent,
    SharedRequestDetailsComponent,
    AddBanksComponent,
    BankDetailsComponent,
    DndDirective,
    DashboardComponent,
    CardComponent,
    PieChartComponent,
    AddFeAndDisputeIdComponent,
    DisputeMemoComponent,
    ArchiveDocumentComponent,
    NewRequestsComponent,
    OtherBankDiputeRequest,
    CreateOtherBankDisputeRequest,
    DirectRequestDetailsComponent,
    ErrorPageComponent,
    TipAboutRequestsComponent,
    AssignedRequestsComponent,
    LinksComponent,
    GreetingComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSnackBarModule,
    MatChipsModule,
    MatSelectModule,
    MatDialogModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgxMaterialTimepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    AppRoutingModule,
    HttpClientModule,
    MatGridListModule,
    MatBadgeModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    
    // NgbModule,
    FormsModule,
    MatTabsModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatStepperModule,
    MatToolbarModule,
    ChartsModule,
    LayoutModule,
    MatProgressBarModule,
    InfiniteScrollModule,
    NgxPrintModule,
    MatCheckboxModule,
    MatSelectInfiniteScrollModule,
    KeycloakAngularModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ["http://10.1.22.72:8083/*", "http://10.1.12.70:8083/*"],
    
        sendAccessToken: true,
      },
    })
  ],
  providers: [
    DatePipe,
    // NotAuthGuard,
    // AutoLogoutService,
    AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   multi: true,
    //   deps: [KeycloakService]
    // }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
