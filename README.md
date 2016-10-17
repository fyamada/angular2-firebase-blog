# Angular2 Firebase Blog

### !! This project is under construction and maybe not fully functional !!

### Personal web blog seed project based on [Angular 2](https://angular.io) and [Firebase](https://firebase.google.com/) 

This repo was seeded by [angular2-webpack-starter] (https://github.com/AngularClass/angular2-webpack-starter)

### Quick start
**Make sure you have Node version >= 5.0 and NPM >= 3**
> Clone/Download the repo then edit `app.ts` inside [`/src/app/app.ts`](/src/app/app.ts)

```
# clone our repo
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/fyamada/angular2-firebase-blog.git
```

### Firebase configuration
You need to create your Firebase account and project. Once you have a project, open it and select **Add Firebase to your web app** in the overview screen.
This will pop up a panel with the configuration data you need to set the const **FIREBASE_CONFIG** in the webpack config files.

Firebase configuration for development: 

> /config/webpack.dev.js

Firebase configuration for production:

> /config/webpack.prod.js
