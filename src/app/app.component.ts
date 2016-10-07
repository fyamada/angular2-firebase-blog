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
  <nav class="navbar navbar-default navbar-custom navbar-fixed-top {{isfixed}} {{istransparent}}" *ngIf="showNav" aria-expanded="false">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header page-scroll">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <i class="fa fa-bars"></i>
                </button>
                <a routerLink="/home" routerLinkActive="active" class="navbar-brand">
                    <span><img src="assets/icon/android-icon-36x36.png"></span>
                    {{brandText}}
                </a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a routerLink="/home" routerLinkActive="active">Home</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                    <li>
                        <a href="/posts">Posts</a>
                    </li>
                    <li>
                        <a href="/contact">Contact</a>
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
  istransparent: string = "";
  isfixed: string = "";

  constructor(
    private renderer: Renderer,
    public appState: AppState,
    public firebaseService: FirebaseService) {
      this.showNav = true;
      firebaseService.initializeApp();

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
    this.listenFunc = this.renderer.listenGlobal('window', 'scroll', (event : any) => {
            var st = event.currentTarget.pageYOffset;
            if(!this.lastScrollTop)
                this.lastScrollTop = 0;
            if (st > this.lastScrollTop && !this.preventNavHide){
                this.showNav = false;
            } else {
               this.showNav = true;
               st <= 0 ? this.istransparent = "" : this.istransparent = "is-transparent";
               st <= 0 ? this.isfixed = "" : this.isfixed = "is-fixed";
            }
            this.lastScrollTop = st;
        });     
  }

  onScroll(evt: any) {
        var st = evt.currentTarget.pageYOffset;
        if(!this.lastScrollTop)
            this.lastScrollTop = 0;
        if (st > this.lastScrollTop){
            // downscroll code
            console.log('down');
        } else {
           // upscroll code
        console.log('up');
        }
        this.lastScrollTop = st;
    }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
