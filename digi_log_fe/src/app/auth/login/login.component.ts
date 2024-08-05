import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';

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
        this._location.back();
      }, 
      error: (e) => {
        
      }
    })
    
  }
}
