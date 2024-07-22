import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventBrowserComponent } from './event/event-browser/event-browser.component';
import { EventEditorComponent } from './event/event-editor/event-editor.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'events', component: EventBrowserComponent },
  { path: 'event/new', redirectTo: '/event/0', pathMatch: 'full' },
  { path: 'event/:id', component: EventEditorComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
