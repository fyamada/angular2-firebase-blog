import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Location  } from '@angular/common';
import{ActivatedRoute, Params, Router} from '@angular/router';

import { AppState } from '../app.service';
import { FirebaseService } from '../boundary/firebase.service';
//Entities
import { Post } from '../entity/post';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
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
  posts: Post[] = [];
  selectedPost: Post;
  contentKey: string;
  postName: string;
  // TypeScript public modifiers
  constructor(public appState: AppState, 
    private router: Router,
    private location: Location,
    public route: ActivatedRoute,
    public firebaseService: FirebaseService,
    private cdr:ChangeDetectorRef) {
      
  }

  ngOnInit() {
    let self = this;
    this.route.params.forEach((params: Params) => {
      self.contentKey = params['contentKey'];
      self.postName = params['postName'];
      if(self.selectedPost && self.selectedPost.content) { // Check if I already have this content loaded from db
        self.content = self.selectedPost.content
        if(!self.postName) {
          self.postName = self.selectedPost.name
          self.location.go(self.location.path() + "/" + self.postName);
        }
      } else {
        self.getContentFromRealtimeDatabase(self.contentKey);
      }
    });
    
    this.syncPublishedPosts();
  }

  submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.appState.add(value);
    this.localState.value = '';
  }

  getContentFromStorage(contentKey:string) {
    var service = this.firebaseService;
    service
      .getPostContentStorageDownloadUrl(contentKey)
      .then( (url) => {
        return service.getPostContentFromStorage(url);
      })
      .then(data => {
        this.content = data;
        this.cdr.detectChanges();
      });
  }
  getContentFromRealtimeDatabase(contentKey:string) {
    var service = this.firebaseService;
    var self = this; // Preserve context to the promise/callback
    service
      .getPostContent(contentKey)
      .then(snapshot => {
          if(snapshot.val()) {
            self.content = snapshot.val();
            if(self.selectedPost)
              self.selectedPost.content = self.content as string;
          } else {
            self.content = "<div class='alert alert-danger full-width'>The post <code>"+self.contentKey+"</code> was not found.</div>";
          }
          self.cdr.detectChanges();
        }, error => {
          self.content = "<div class='alert alert-danger full-width'>The post <code>"+self.contentKey+"</code> could not be accessed. "+ error+"</div>";
        });
  }
  syncPublishedPosts() {
    var self = this; // Preserve context to the promise/callback
    this.firebaseService.syncPublishedPosts(function(snapshot) {
      self.posts = [];
      let found: boolean = false;
      var post: Post;
      snapshot.forEach(function(childSnapshot) {
        post = childSnapshot.val();
        if(self.contentKey && post.contentKey === self.contentKey) { // If I do have the post content key (from deep link url) I must select the post with such key
          self.selectedPost = post;
          found = true;
        } else if(!self.selectedPost) { // otherwise select the first if not set, or leave the previously selected post unchanged
          self.selectedPost = post;
        }
        self.posts.push(post);
      });
      if(!found) {
        if(self.contentKey) // If I do have an post name, it means someone is looking for a specific post not found
          self.content = "<div class='alert alert-danger full-width'>The post <code>"+self.contentKey+"</code> was not found.</div>";
        else if(self.selectedPost)// just route to the default post allowing deep linking
          self.router.navigate(['/post/' + self.selectedPost.contentKey]); // Allow deep linking to the automatic post loaded
      }
      if(self.selectedPost) {
        if(!self.postName) {
          self.postName = self.selectedPost.name
          self.location.go(self.location.path() + "/" + self.postName);
        }
      }
      self.cdr.detectChanges();
    });
  }

  onSelect(post: Post) {
    this.selectedPost = post;
    this.router.navigate(['/post/' + post.contentKey]);
  }

}
