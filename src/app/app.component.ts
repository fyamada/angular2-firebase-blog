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
    './app.style.css',
    './clean-blog.css'
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
                <a class="navbar-brand" href="index.html">Fabio Yamada</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a href="index.html">Home</a>
                    </li>
                    <li>
                        <a href="about.html">About</a>
                    </li>
                    <li>
                        <a href="post.html">Sample Post</a>
                    </li>
                    <li>
                        <a href="contact.html">Contact</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
  </nav>
  <router-outlet></router-outlet>
  


















  <span class="app-action" [class.m2app-dark]="isDarkTheme">
    <button md-fab><md-icon>check circle</md-icon></button>
  </span>

  <pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>

  <footer>
      <span>WebPack Angular 2 Starter by <a [href]="url">@AngularClass</a></span>
      <div>
        <a [href]="url">
          <img [src]="angularclassLogo" width="25%">
        </a>
      </div>
  </footer>
  `
})
export class App implements OnInit {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';
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
