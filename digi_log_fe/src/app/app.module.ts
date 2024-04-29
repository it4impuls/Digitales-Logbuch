import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatToolbarModule } from "@angular/material/toolbar";

import { EventBrowserComponent } from './event/event-browser/event-browser.component';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EventEditorComponent } from './event/event-editor/event-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';


@NgModule({
  declarations: [AppComponent, EventBrowserComponent, EventEditorComponent, LoginComponent, SignupComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    HttpClientXsrfModule
  ],
  providers: [provideAnimationsAsync("noop"), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
