import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatNativeDateModule } from "@angular/material/core";
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { routes } from "./app-routing.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";





export const imports = [
  BrowserModule,
  AppRoutingModule,
  HttpClientModule,
  MatTableModule,
  MatInputModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatNativeDateModule,
  MatListModule,
  MatCheckboxModule,
  NgxMaterialTimepickerModule,
  ReactiveFormsModule,
  MatButtonModule,
  HttpClientXsrfModule,
];


export const imports_test = [
  MatTableModule,
  MatInputModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatNativeDateModule,
  MatListModule,
  MatCheckboxModule,
  NgxMaterialTimepickerModule,
  MatButtonModule,
];