/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, OnInit, Renderer } from '@angular/core';

import { AppState } from './app.service';
import { FirebaseService } from './boundary/firebase.service';


/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],
  template: `
  <nav class="navbar navbar-default navbar-custom {{isfixed}} {{istransparent}}" *ngIf="showNav" aria-expanded="false">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header page-scroll">
                <button  (click)="isCollapsed = !isCollapsed" type="button" class="navbar-toggle collapsed">
                    <span class="sr-only">Toggle navigation</span>
                    <i class="fa fa-bars"></i>
                </button>
                <a routerLink="/home" routerLinkActive="active" class="navbar-brand">
                    <span><img src="assets/icon/android-icon-36x36.png"></span>
                    {{brandText}}
                </a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"
            [attr.aria-expanded]="!isCollapsed" [ngClass]="{collapse: isCollapsed}">
                <ul class="nav navbar-nav navbar-right" (click)="isCollapsed = !isCollapsed">
                    <li>
                        <a routerLink="/home" routerLinkActive="active">Home</a>
                    </li>
                    <li>
                        <a routerLink="/about" routerLinkActive="active">About</a>
                    </li>
                    <li>
                        <a routerLink="/posts" routerLinkActive="active">Posts</a>
                    </li>
                    <li>
                        <a routerLink="/contact" routerLinkActive="active">Contact</a>
                    </li>
                    <li>
                        <a (click)="loginLogout()">{{loginLogoutLabel}}</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
  </nav>
  <router-outlet></router-outlet>
  <footer>
      <span>Angular 2 Firebase Blog Starter by <a [href]="url">@fyamada</a></span>
      <div>
        <a [href]="url">
          <img [src]="angularFirebaseLogo">
        </a>
      </div>
  </footer>
  `
})
export class App implements OnInit {
    angularFirebaseLogo = 'assets/img/angular2firebase-avatar.png';
    name = 'Angular 2 Firebase Blog';
    url = 'https://fabio-yamada.com';
    brandText = 'Yamada';
    showNav : boolean;
    lastScrollTop : number;
    listenFunc: Function;
    preventNavHide : boolean;
    isCollapsed : boolean = true;
    istransparent: string = "";
    isfixed: string = "";
    user:any;
    loginLogoutLabel: string = "Login";

    constructor(
        private renderer: Renderer,
        public appState: AppState,
        public firebaseService: FirebaseService) {
        this.showNav = true;
        firebaseService.initializeApp();
    }

    ngOnInit() {
        // Hook listener to display/hide navbar
        this.listenFunc = this.renderer.listenGlobal('window', 'scroll', (event : any) => {
                var st = event.currentTarget.pageYOffset;
                if(!this.lastScrollTop)
                    this.lastScrollTop = 0;
                if (st > this.lastScrollTop && !this.preventNavHide){
                    this.showNav = false;
                } else {
                this.showNav = true;
                this.istransparent = (st <= 0 ?  "" : "is-transparent");
                this.isfixed = (st <= 0 ?  "" : "is-fixed");
                }
                this.lastScrollTop = st;
            }); 
        // Observe the auth user state
        var self = this; // Preserve context to the promise/callback
        this.firebaseService.getUser().subscribe((user) => {
            self.user = user;
            self.loginLogoutLabel = user ? "Logout" : "Login";
            if (user != null) {
                user.providerData.forEach(function (profile) {
                    console.log("Sign-in provider: "+profile.providerId);
                    console.log("  Provider-specific UID: "+profile.uid);
                    console.log("  Name: "+profile.displayName);
                    console.log("  Email: "+profile.email);
                    console.log("  Photo URL: "+profile.photoURL);
                });
            }
        });    
    }
    
    loginLogout() {
        if(this.user) {
            this.firebaseService.signOut().then(function() {
                // Sign-out successful.
                }, function(error) {
                // An error happened.
                }
            );
        } else {
            this.firebaseService.signIn().then(function(result) {
                if (result.credential) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // ...
                }
                // The signed-in user info.
                this.user = result.user;
                // ...
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
            // ...
            });
        }
        
    }   
}
