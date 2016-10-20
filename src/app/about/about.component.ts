import { Component, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../boundary/firebase.service';

@Component({
  selector: 'about',
  styles: [`
  `],
  template: `
    <header class="intro-header" style="background-image: url('assets/img/about.jpg')">
      <div class="container">
          <div class="row">
              <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                  <div class="site-heading">
                  </div>
              </div>
          </div>
      </div>
    </header>
    <body>    
        <div class="container">
            <div class="row">
                <div class="col-sm-8 blog-main" *ngIf="content" [innerHTML]="content">
                </div>
            </div>
        </div>
    </body>
  `
})
export class About {
  content: string = '';
  localState: any;
  constructor(public firebaseService: FirebaseService,
    private cdr:ChangeDetectorRef) {

  }

  ngOnInit() {
    this.getContentFromRealtimeDatabase();
  }

  getContentFromRealtimeDatabase() {
    var service = this.firebaseService;
    var self = this; // Preserve context to the promise/callback
    service
      .getAboutContent()
      .then(snapshot => {
          if(snapshot.val()) {
            self.content = snapshot.val();
          } else {
            self.content = "<div class='alert alert-danger full-width'>About content was not found.</div>";
          }
          self.cdr.detectChanges();
        }, error => {
          self.content = "<div class='alert alert-danger full-width'>About content was not found. "+ error+"</div>";
        });
  }
}
