import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { Location } from '@angular/common';
import { CookieService } from '../../services/cookie.service';
import { CookieType } from '../../interfaces';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.less",
})
export class LoginComponent {
  constructor(
    private http:HttpService,
    private formBuilder:FormBuilder, 
    private _location:Location){

  }
  
  loginForm = this.formBuilder.group({username:"", password:""})
  

  
  async login() {HttpService;
    let lForm = this.loginForm.controls
    let res = this.http.login(
      lForm.username.value ?? '',
      lForm.password.value ?? ''
    );

    res.subscribe({
      next: (data) => {
        // this.auth.updateLoggedInAs(data.uname);
        this._location.back();
      }, 
      error: (e) => {
        
      }
    })
    
  }
}
