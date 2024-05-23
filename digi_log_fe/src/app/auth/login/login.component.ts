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
    private auth:AuthService, 
    private formBuilder:FormBuilder, 
    private router:Router, 
    private _location:Location,
    private cookieService:CookieService){

  }
  
  loginForm = this.formBuilder.group({"username":"", "password":""})
  error = ""
  
  async login() {HttpService;
    let res = this.http.login(this.loginForm.controls.username.value??"", this.loginForm.controls.password.value??"")

    res.subscribe({
      next: (data) => {
        console.log(data);
        this.auth.TOKEN = data["access"];
        this._location.back();
        this.cookieService.addToCookie(CookieType.accessToken, data["access"], ["httponly"]);
        this.cookieService.addToCookie(
          CookieType.refreshToken,
          data['refresh'],
          ['httponly']
        );
        this.cookieService.addToCookie(CookieType.username, data["uname"]);
      }, 
      error: (e) => {
        console.error(e)
        switch(e.status){
          case 400:
            this.error = "Bad request"
            break;
          case 401:
            this.error = "Falscher Benutzername/Kennwort"
            break;
          default:
            this.error = e.message;
        }
      }
    })
    
  }
}
