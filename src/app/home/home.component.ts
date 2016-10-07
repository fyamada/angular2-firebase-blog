import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import{ActivatedRoute, Params, Router} from '@angular/router';

import { AppState } from '../app.service';
import { FirebaseService } from '../boundary/firebase.service';
import { Title } from './title';
import { XLarge } from './x-large';

//Entities
import { Article } from '../entity/article';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.style.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.template.html'
})
export class Home implements OnInit {
  // Set our default values
  localState = { value: '' };
  content:String = '';
  articles: Article[] = [];
  selectedArticle: Article;
  articleName: string;
  // TypeScript public modifiers
  constructor(public appState: AppState, 
    private router: Router,
    public route: ActivatedRoute,
    public title: Title,
    public firebaseService: FirebaseService,
    private cdr:ChangeDetectorRef) {

  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
        this.articleName = params['articleName'];
      });
    
    this.syncPublishedArticles();
  }

  submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.appState.add(value);
    this.localState.value = '';
  }

  getContent(articleName:string) {
    var service = this.firebaseService;
    service
      .getContentUrl(articleName ? articleName : 'article_test.html')
      .then( (url) => {
        return service.getContentData(url);
      })
      .then(data => {
        this.content = data;
        this.cdr.detectChanges();
      });
  }

  syncPublishedArticles() {
    var self = this; // Preserve context to the promise/callback
  /*  this.firebaseService.syncOncePublishedArticles()
      .then(snapshot => {
          snapshot.forEach(function(childSnapshot) {
            self.articles.push(childSnapshot.val());
          });
      }); */
       this.firebaseService.syncPublishedArticles(function(snapshot) {
         self.articles = [];
         snapshot.forEach(function(childSnapshot) {
            if(self.articleName && childSnapshot.val().article === self.articleName) // If I do have the article name I must select the article with such name
              self.selectedArticle = childSnapshot.val();
            else // otherwise select the first if not set, or leave the previously selected article unchanged
              self.selectedArticle = !self.selectedArticle ? childSnapshot.val() : self.selectedArticle;
            self.articles.push(childSnapshot.val());
          });
          self.cdr.detectChanges();
       });
  }

  onSelect(article: Article) {
    this.selectedArticle = article;
    this.router.navigate(['/article/' + article.article]);
  }
}
