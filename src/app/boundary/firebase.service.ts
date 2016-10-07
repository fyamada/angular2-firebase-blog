import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Article } from '../entity/article';

var firebase = require('firebase');
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class FirebaseService {
    app:any;
    dbPublishedArticlesReference: firebase.database.Reference;
    gsContentReference: firebase.storage.Reference;
    
    /**
     * Get the firebase project configuration data 
     */
    config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      storageBucket: "",
      messagingSenderId: ""
    };

    constructor (private http: Http) {
    }

    initializeApp():void {
        this.app = firebase.initializeApp(this.config);
        this.dbPublishedArticlesReference = firebase.database().ref('publishedArticles');
        this.gsContentReference = firebase.storage().ref().child('content');
    }

    /**
     * This function download the firebase storage content referenced by getDownloadURL.
     * For this to work, the firebase sotrage bucket need to be set to accept CORS.
     * http://stackoverflow.com/questions/37760695/firebase-storage-and-access-control-allow-origin  
     */
    getContentData(url : string): Promise<string> {
        return this.http.get(url)
                    .toPromise()
                    .then(res => res.text())
                    .catch(this.handleErrorPromise);
    }

    getContentUrl(contentName:string): firebase.Promise<any> {
        return this.gsContentReference.child(contentName).getDownloadURL();
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
          throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        if(body.notAuthenticated) {
          throw new Error('Login timed out.');
        }
        return body || { };
    }

    private handleErrorObservable (error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        //alert("errMsg: " + JSON.stringify(error));
        var errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private handleErrorPromise(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    /**
     * Return the promise for the value event listener. This function works only once.
     * The type of Promise is firebase.database.DataSnapshot. 
     * We let any to not require the import of firebase library in the caller.
     */
    public syncOncePublishedArticles(): Promise<any> {
        var dbPublishedArticlesReference = this.dbPublishedArticlesReference;
        return new Promise(function(resolve, reject) {
            dbPublishedArticlesReference.on('value', resolve);
        });
        
    }

    /**
     * Bind the callback to the value event listener.
     */
    public syncPublishedArticles(callback) {
        var dbPublishedArticlesReference = firebase.database().ref('publishedArticles');
        dbPublishedArticlesReference.on('value', callback);
    }
}