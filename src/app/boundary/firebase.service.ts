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
    app:any;
    /**
     * Real time database reference
     */
    dbPublishedArticlesReference: firebase.database.Reference;
    /**
     * Storage reference
     */
    gsContentReference: firebase.storage.Reference;
    
    constructor (private http: Http) {
    }

    initializeApp():void {
        this.app = firebase.initializeApp(process.env.FIREBASE_CONFIG); // Set the firebase configuration in webpack.prod/dev files
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

    /**
     * Fetch the download URL for the given a contentName. 
     * This call was taking about 500ms to return the URL. 
     */
    getContentUrl(contentName:string): firebase.Promise<any> {
        return this.gsContentReference.child(contentName).getDownloadURL();
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