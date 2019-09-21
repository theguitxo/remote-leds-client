import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DemoPlayerComponent } from './components/demo-player/demo-player.component';
import { SaveComponent } from './components/save/save.component';
import { LoadComponent } from './components/load/load.component';

/**
 * home: Home page of the app
 * demo: For playing a demo of the sequence before sending to the server
 * save: Page for save, as new, or rename, a sequence
 * load: Page to load a sequence from the local storage
 */
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'demo', component: DemoPlayerComponent },
  { path: 'save', component: SaveComponent },
  { path: 'load', component: LoadComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
