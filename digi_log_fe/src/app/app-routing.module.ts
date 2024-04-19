import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventBrowserComponent } from './event/event-browser/event-browser.component';

const routes: Routes = [
  { path: "", redirectTo: "/events", pathMatch: "full" },
  { path: "events", component: EventBrowserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
