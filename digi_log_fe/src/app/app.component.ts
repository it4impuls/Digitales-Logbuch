import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http.service';
import { AuthService } from './services/auth.service';
import { CookieService } from './services/cookie.service';
import { CookieType } from './interfaces';



@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.less",
})
export class AppComponent implements OnInit{
  title = "digi_log_fe";
  constructor(private cookieService:CookieService, public authService:AuthService, private http:HttpService) {}

  uname = ""

  ngOnInit(): void {
    this.authService.refreshTokens()
    this.uname = this.cookieService.getValue(CookieType.username)??""
  }
  
  logout(){
    this.authService.logout()
  }
  test(){
    this.http.postTest().then(ret => console.log(ret));
  }
  refresh(){
    this.authService
  }
}
