import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Article } from '../entity/article';

var firebase = require('firebase');
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class FirebaseService {
    /**
     * Firebase app reference
     */
    private app:any;
    /**
     * Real time database reference
     */
    private dbPublishedPostsReference: firebase.database.Reference;
    /**
     * Storage reference
     */
    private gsContentReference: firebase.storage.Reference;
    /**
     * Firebase Auth user observable. Use the getUser function to 
     * access this observable and subscribe to changes. 
     */
    private user: Observable<any>;
    
    constructor (private http: Http) {
    }

    initializeApp():void {
        this.app = firebase.initializeApp(process.env.FIREBASE_CONFIG); // Set the firebase configuration in webpack.prod/dev files
        this.dbPublishedPostsReference = firebase.database().ref('publishedPosts');
        this.gsContentReference = firebase.storage().ref().child('content');
        // Let's monitor the login state creating an observable. The logic of logged in/out is implemented in the subscriber
        this.user = Observable.create((observer) => {
            firebase.auth().onAuthStateChanged((user) => {
                observer.next(user);
            });
        });
    }

    /**
     * This function download the firebase storage content referenced by getDownloadURL.
     * For this to work, the firebase sotrage bucket need to be set to accept CORS.
     * http://stackoverflow.com/questions/37760695/firebase-storage-and-access-control-allow-origin  
     */
    getPostContentFromStorage(url : string): Promise<string> {
        return this.http.get(url)
                    .toPromise()
                    .then(res => res.text())
                    .catch(this.handleErrorPromise);
    }

    /**
     * Fetch post content given the articleName
     */
    getPostContent(contentKey : string): Promise<any> {
        var dbPublishedPostsReference = firebase.database().ref('postContent/'+contentKey);
        return dbPublishedPostsReference.once('value');
    }

    /**
     * Fetch about content.
     */
    getAboutContent(): Promise<any> {
        return firebase.database().ref('aboutContent').once('value');
    }

    /**
     * Fetch no content content.
     */
    getNoContent(): Promise<any> {
        return firebase.database().ref('noContent').once('value');
    }

    /**
     * Fetch the download URL for the given a contentName. 
     * This call was taking about 500ms to return the URL. 
     */
    getPostContentStorageDownloadUrl(contentKey:string): firebase.Promise<any> {
        return this.gsContentReference.child(contentKey).getDownloadURL();
    }

    private handleErrorPromise(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    /**
     * Return the promise for the value event listener. This function works only once.
     * The type of Promise is firebase.database.DataSnapshot. 
     * We let any to do not require the import of firebase library in the caller.
     */
    public syncOncePublishedPosts(): Promise<any> {
        var dbPublishedPostsReference = this.dbPublishedPostsReference;
        return new Promise(function(resolve, reject) {
            dbPublishedPostsReference.on('value', resolve);
        });
        
    }

    /**
     * Bind the callback to the value event listener.
     */
    public syncPublishedPosts(callback) {
        var dbPublishedPostsReference = firebase.database().ref('publishedPosts');
        dbPublishedPostsReference.on('value', callback);
    }

    public signIn(): Promise<any> {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithRedirect(provider);
        return firebase.auth().getRedirectResult();
    }

    public signOut(): Promise<any> {
        return firebase.auth().signOut();
    }

    public getUser(): Observable<any> {
        return this.user;
    }


}