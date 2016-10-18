import { Routes, RouterModule } from '@angular/router';
import { Home } from './home';
import { Posts } from './posts';
import { About } from './about';
import { NoContent } from './no-content';

import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '',      component: Home },
  { path: 'home',  component: Home },
  { path: 'post/:contentKey',  component: Home },
  { path: 'post/:contentKey/:postName',  component: Home },
  { path: 'about', component: About },
  { path: 'posts', component: Posts },
  {
    path: 'detail', loadChildren: () => System.import('./+detail')
  },
  { path: '**',    component: NoContent },
];
