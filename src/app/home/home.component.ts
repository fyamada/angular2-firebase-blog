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
      this.getContentFromRealtimeDatabase(this.articleName);
    });
    
    this.syncPublishedArticles();
  }

  submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.appState.add(value);
    this.localState.value = '';
  }

  getContentFromStorage(articleName:string) {
    var service = this.firebaseService;
    service
      .getContentUrl(articleName ? articleName : 'article_test')
      .then( (url) => {
        return service.getContentData(url);
      })
      .then(data => {
        this.content = data;
        this.cdr.detectChanges();
      });
  }
  getContentFromRealtimeDatabase(articleName:string) {
    var service = this.firebaseService;
    var self = this; // Preserve context to the promise/callback
    service
      .getArticleContent(articleName ? articleName : 'article_test')
      .then(snapshot => {
        if(snapshot.val()) {
          self.content = snapshot.val();
        } else {
          self.content = "<div class='alert alert-danger full-width'>The article <code>"+self.articleName+"</code> was not found.</div>";
        }
        self.cdr.detectChanges();
      });
  }
  syncPublishedArticles() {
    var self = this; // Preserve context to the promise/callback
    this.firebaseService.syncPublishedArticles(function(snapshot) {
      self.articles = [];
      let found: boolean = false;
      snapshot.forEach(function(childSnapshot) {
        if(self.articleName && childSnapshot.val().article === self.articleName) { // If I do have the article name (from deep link url) I must select the article with such name
          self.selectedArticle = childSnapshot.val();
          found = true;
        } else if(!self.selectedArticle) { // otherwise select the first if not set, or leave the previously selected article unchanged
          self.selectedArticle = childSnapshot.val();
        }
        self.articles.push(childSnapshot.val());
      });
      if(!found) {
        if(self.articleName) // If I do have an article name, it means someone is looking for a specific article not found
          self.content = "<div class='alert alert-danger full-width'>The article <code>"+self.articleName+"</code> was not found.</div>";
        else // just route to the default article allowing deep linking
          self.router.navigate(['/article/' + self.selectedArticle.article]); // Allow deep linking to the automatic article loaded
      }
      self.cdr.detectChanges();
    });
  }

  onSelect(article: Article) {
    this.selectedArticle = article;
    this.router.navigate(['/article/' + article.article]);
  }

}
