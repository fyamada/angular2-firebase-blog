import { Component } from '@angular/core';

@Component({
  selector: 'no-content',
  template: `
    <header class="intro-header" style="background-image: url('assets/img/nocontent.jpg')">
      <div class="container">
          <div class="row">
              <div class="site-heading">
                  <h1>404</h1>
                  <hr class="small">
                  <span class="subheading">File not found, sorry.</span>
              </div>
          </div>
      </div>
    </header>
  `
})
export class NoContent {
  
}
