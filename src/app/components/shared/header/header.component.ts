import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HostListener, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { OAuthService } from 'angular-oauth2-oidc';
import {  BehaviorSubject, Observable,  } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
// import { UserService } from 'src/app/services/user.service';
import { Router, NavigationStart, NavigationEnd, Event } from "@angular/router";

import { authConfig } from 'src/app/config/authConfig';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { L } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentRole!: any;

  notificationCoount!: number;
  notificationBranchCoount!: number;
  notificationEbankingCoount!: number;
  isBadgeDisabled = false;

  // title = 'frontend';

  roles: any;


  status!:boolean;



  navbarCollapsed!: boolean;
  user_id!: number;
  allRequest: any;
  data: any;
  request_id!: number;

  username$!: Observable<string>;
  activeUserRole$!:Observable<string>;

  allForChecker:any[] = [];

  readNotifications: any[] = [];

  readBranchNotifications: any[] = [];

  isUserLoggedIn$!: Observable<boolean>;
  check!: any;
  checkLoginFromStorage!: boolean;
 
  maker!:any;
  
  showNotification!: boolean; 


  isDarkThemeActive=false;

  checker_branch:any;

  isHanset$:Observable<boolean> = this.breakPointObserver.observe(Breakpoints.Handset)
  .pipe(map(result => result.matches),
    shareReplay());

  hide:boolean=false;

  allNotificationCounter:number=0;
  makerBranchNotificationCounter:number=0;
  payerBranchNotificationCounter:number=0;

  allNotifications:any[]=[];
  makerNotifications:any[]=[];
  payerNotifications:any[]=[];

  pageNumber: number = 0;
  pageSize: number = 10;
  showMenu:boolean = false;

  loading:boolean=false;
  branchName:string='';
  accessRoles:any[]=[];
 
  // update Notificationcouter using behavior subject
  public allNotifications$ = new BehaviorSubject<number>(0);
  @ViewChild('navcontainer') navcontainer!: MatSidenavContainer;

  selectedItem = '';

  listItems = [
    { linkTitle: 'On-Us Disputes', link: "/dispute-requests/on-us", icon:'star_half'},
    { linkTitle: 'Off-Us Disputes', link: "/dispute-requests/off-us", icon:'domain' },
    { linkTitle: 'Not-Found Disputes', link: "/dispute-requests/not-found", icon:'style' },
    // { linkTitle: 'Acknowledged Disputes', link: "/dispute-requests/acknowledged", icon:'add_alert'},
    // { linkTitle: 'Home 5', link: '/home-e' },
  ];


  approverView = [
    { linkTitle: 'Acknowleged Disputes', link: "/dispute-requests/acknowledged", icon:'star_half'},
    { linkTitle: 'Approved Disputes', link: "/dispute-requests/acknowledged/approved", icon:'star_half'},
    { linkTitle: 'Settled Disputes', link: "/dispute-requests/acknowledged/settled", icon:'domain' },
  ];
  
  constructor(
    private oauthService:OAuthService,
    private authService:AuthService,
    private router: Router,
    private employeeService:EmployeeService,
    private breakPointObserver:BreakpointObserver,
    private notificationService: NotificationService
  ) {

    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.loading = true;
      }

      if (routerEvent instanceof NavigationEnd) {
        this.loading = false;
      }
    });
  this.init();

  }


  
  getRoles()
  {
   this.accessRoles =  this.authService.getUserRoles();
   console.log(this.accessRoles)
  }

  public init() {
    // tslint:disable-next-line:no-unused-expression
    //this.router.navigate['/'];
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndLogin().then(() =>
    {
      this.getRoles();
      //  this.getEmployeeId();
       this.getEmployee()
       this.router.navigate(["/dashboard"])

       if(this.hasEbankingUserRole()){
        this.onGetAllUnreadNotifications('NEW', this.pageNumber, this.pageSize);
      }
      else if(this.hasDisputeInitiatorRole()){
        this.onGetAllUnreadNotificationByBranch(this.pageNumber, this.pageSize);
      }
      
    });
    this.oauthService.setStorage(localStorage);
    this.oauthService.setupAutomaticSilentRefresh();


  }


  ngOnInit() {
    this.getRoles()
    this.isDarkThemeActive = localStorage.getItem('theme') === "Dark" ? true : false;
 
    console.log(this.isDarkThemeActive, "dark?")

    // if(this.hasEbankingUserRole()){
    //   this.onGetAllUnreadNotifications('NEW', this.pageNumber, this.pageSize);
    // }
    // else if(this.hasDisputeInitiatorRole()){
    //   this.onGetAllUnreadNotificationByBranch(this.pageNumber, this.pageSize);
    // }
    
  }

  public onLogOut() {
    this.oauthService.logOut();
  }


  public login() {
    this.oauthService.initImplicitFlow();
  }



  public get userName() {
    const cliams = this.oauthService.getIdentityClaims();
    if (!cliams) { return null; }

    return (cliams as any).given_name;
  }

  public get fullName()
  {
    return (<any>this.authService.getTokenDetails()).name;
  }


  getEmployee() {
    const employeeId = this.authService.getEmployeeId();
    this.employeeService
      .getEmployeeByemployeeId(employeeId)
      .subscribe((data:any) => {
        this.branchName = data.branch.name;
      });
  }


  hasDisputeInitiatorRole = () =>{
    if(this.accessRoles.includes("dispute_initiator")){
      return true;
    }
    else return false;
  }


  hasDisputeApproverRole = () =>{
    if(this.accessRoles.includes("dispute_approver")){
      return true;
    }
    else return false;
  }

  hasEbankingUserRole = () =>{
    if(this.accessRoles.includes("ebanking_user")){
      return true;
    }
    else return false;
  }

  hasDisputeDBAdminRole = () =>{
    if(this.accessRoles.includes("dispute_db_admin")){
      return true;
    }
    else return false;
  }

  hasDisputeSystemAdminRole = () =>{
    if(this.accessRoles.includes("dispute_system_admin")){
      return true;
    }
    else return false;
  }


 
  // logOut() {
  //   this.allNotificationCounter = 0;
  //   this.makerBranchNotificationCounter = 0;
  //   this.notificationService.updateNotifications(this.allNotificationCounter);
  //   this.notificationService.updateNotifications(this.makerBranchNotificationCounter);
  //     // this.userService.signOut();
  // }



  @HostListener("click", ["$event"])
  public onClick(event: any): void
  {
      event.stopPropagation();
  }


  // storeThemeSelection

  storeThemeSelection(){
    localStorage.setItem('theme', this.isDarkThemeActive ? "Dark" : "Light");
    this.hide = !this.hide;
  }


  navigateToProfile() {
      this.router.navigate(['/user-profile']);
  }

 

  openNotification(state: boolean) {
    this.showNotification = state;
  }

  // new updates
  // onGetAllNotification = () =>{
  //   this.notificationService.getNewNotificationType().subscribe((res:any)=>{
  //     this.allNotifications = res.content;
  //     this.allNotifications.forEach((nots, index)=>{
  //       if(nots?.status === 'unread'){
  //         this.allNotificationCounter += 1
  //       this.notificationService.updateNotifications(this.allNotificationCounter);
  //       }

  //     })
  //   })
  // }

  // onGetMakerNotification = () =>{
  //   this.notificationService.updateNotifications(0);
  //   this.notificationService.getMakerNotification().subscribe((res:any)=>{
  //     this.makerNotifications = res.content;
  //     console.log(this.makerBranchNotificationCounter)
  //     this.makerNotifications.forEach((nots,index)=>{
  //       if(nots?.notificationType === 'REVERSED' || nots?.notificationType === 'APPROVE' || nots?.notificationType === 'DECLINE' || nots?.notificationType === 'RECEIVE'){
  //         this.makerBranchNotificationCounter += 1
  //       }
       
  //     })
  //     this.notificationService.updateNotifications(this.makerBranchNotificationCounter);
  //   })
  // }

  // onGetPayerNotification = () =>{
  //   this.notificationService.getPayerBranchNotification().subscribe((res:any)=>{
  //     this.payerNotifications = res.content;
  //     this.payerNotifications.forEach((nots,index)=>{
  //       if(nots?.notificationType === 'REVERSED' || nots?.notificationType === 'APPROVE' || nots?.notificationType === 'DECLINE' || nots?.notificationType === 'RECEIVE'){
  //         this.payerBranchNotificationCounter += 1
  //       }
  //     })
  //   })
  // }

  onScrollDown = () => {
  //   this.allNotificationCounter = 0;
  //   this.makerBranchNotificationCounter = 0;
  //   this.notificationService.updateNotifications(this.allNotificationCounter);
  //   this.notificationService.updateNotifications(this.makerBranchNotificationCounter);
  //   this.notificationService
  //     .getAllNotifications(this.pageNumber, ++this.pageSize)
  //     .subscribe(
  //       (res: any) => {
  //         // this.activeUserRole$.subscribe((res:any) => {
  //         //   if (res === 'ROLE_BANKING' || res === 'ROLE_APPROVER') {
  //         //     this.onGetAllNotification();
  //         //   } else if (res === 'ROLE_USER') {
  //         //     this.onGetMakerNotification();
  //         //     this.onGetPayerNotification();
  //         //   }
  //         // });
  //         this.activeUserRole$.subscribe(res=>{
  //           if(res === 'ROLE_BANKING'){
  //             this.onGetAllNotification();
  //             this.notificationService.updateNotifications(this.allNotificationCounter);
  //           }else if(res === 'ROLE_USER'){
  //             this.onGetMakerNotification();
  //             this.onGetPayerNotification();
  //             this.notificationService.updateNotifications(this.makerBranchNotificationCounter);
  //           }
  //         })
  //       },
  //       (error: any) => {
  //         // this.isInfiniteScrollLoading = false;
  //       }
  //     );
  };


 
  onNavigateToRequestDetails = (id:number, requester_id:number) =>{
    this.notificationService.unreadNotification(id).subscribe(res=>{
      if(this.hasDisputeInitiatorRole()){
        this.onGetAllUnreadNotificationByBranch(this.pageNumber, this.pageSize);
      }else if(this.hasEbankingUserRole()){
        this.onGetAllUnreadNotifications("NEW", this.pageNumber, this.pageSize);
      }
      this.router.navigate(['/requests', requester_id]);

    })
  }


  toggleMenu() {
    this.showMenu = !this.showMenu;
 }


/**
 * Migrated Notification to new endpoint
 */

onGetAllUnreadNotifications = (notificationType:string, pageNumber:number, pageSize:number) =>{
  this.notificationService.getAllUnreadNotifications(notificationType, pageNumber, pageSize).subscribe((res:any)=>{
    this.allNotifications = res?._embedded?.notificationDtoes;
    let ncount = 0;
    this.allNotifications.forEach((not)=>{
      ncount += 1;
      console.log(ncount)
    })
    this.allNotifications$.next(ncount);
    });
}

onGetAllUnreadNotificationByBranch = (pageNumber:number, pageSize:number) =>{
  this.notificationService.getAllUnreadNotificationsByBranchCode(pageNumber, pageSize).subscribe((res:any)=>{
    this.allNotifications = res?._embedded?.notificationDtoes;
    console.log(this.allNotifications)
    let ncount = 0;
    this.allNotifications.forEach((not)=>{
      ncount += 1;
      console.log(ncount)
    })
    this.allNotifications$.next(ncount);
    });

    
}

handleClick(selectedItem:any) {
  this.selectedItem = selectedItem.linkTitle;
}


}

