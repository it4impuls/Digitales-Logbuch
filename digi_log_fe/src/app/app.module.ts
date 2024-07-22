import { NgModule } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventEditorComponent } from './event/event-editor/event-editor.component';
import { EventBrowserComponent } from './event/event-browser/event-browser.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

import { imports } from './app.imports';
import { providers } from './app.providers';

@NgModule({
  declarations: [
    AppComponent,
    EventBrowserComponent,
    EventEditorComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: imports,
  providers: providers,
  bootstrap: [AppComponent],
})
export class AppModule {}
