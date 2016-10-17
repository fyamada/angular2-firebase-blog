import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import{ Router} from '@angular/router';

import { FirebaseService } from '../boundary/firebase.service';

//Entities
import { Article } from '../entity/article';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'posts',  // <home></home>
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './posts.style.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './posts.template.html'
})
export class Posts implements OnInit {
  // Set our default values
  localState = { value: '' };
  content:String = '';
  articles: Article[] = [];
  selectedArticle: Article;
  articleName: string;
  // TypeScript public modifiers
  constructor(
    private router: Router,
    public firebaseService: FirebaseService,
    private cdr:ChangeDetectorRef) {

  }

  ngOnInit() {
    this.syncPublishedArticles();
  }

  syncPublishedArticles() {
    var self = this; // Preserve context to the promise/callback
    this.firebaseService.syncPublishedArticles(function(snapshot) {
        self.articles = [];
        snapshot.forEach(function(childSnapshot) {
            self.articles.push(childSnapshot.val());
        });
        self.cdr.detectChanges();
    });
  }

  onSelect(article: Article) {
    this.router.navigate(['/article/' + article.article]);
  }
}
