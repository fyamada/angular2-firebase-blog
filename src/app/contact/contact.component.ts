import { Component, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../boundary/firebase.service';

@Component({
  selector: 'contact',
  styles: [`
  `],
  template: `
    <header class="intro-header" style="background-image: url('assets/img/contact.jpg')">
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
                <div class="col-sm-8 blog-main">
                </div>
            </div>
        </div>
    </body>
  `
})
export class Contact {
  content: string = '';

  constructor(public firebaseService: FirebaseService,
    private cdr:ChangeDetectorRef) {

  }

  ngOnInit() {
  }

}
