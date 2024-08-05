import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
import { CookieType } from '../interfaces';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private cookieService: CookieService,
    private http: HttpService,
    private router: Router
  ) {}

  // loggedInAs:string|null = ""

  async refreshTokens() {
    this.http.refreshToken().subscribe({
      next: (response) => {},
      error: (err) => {
        console.error(err);
        // this.cookieService.clearAll()
      },
    });
  }

  get loggedInAs() {
    return this.cookieService.getValue(CookieType.username);
  }

  set loggedInAs(value:string|undefined) {
    this.cookieService.addToCookieWithName(CookieType.username, value??"");
  }

  async logout() {
    this.http.logout().subscribe({
      next: (response) => {
        this.cookieService.removeFromCookie(CookieType.username);
        this.cookieService.removeFromCookie(CookieType.refreshToken);
        this.cookieService.removeFromCookie(CookieType.accessToken);
      },
      error: (error) => {
        this.http.openSnackbar("Something went wrong, Couldn't log out");
      },
    });
  }

  // async getToken():Promise<string> {
  //   let token = ""
  //   if (this.TOKEN) {

  //   }else{
  //     let at = this.cookieService.getValue(CookieType.accessToken);
  //     if (at && (await firstValueFrom( this.http.validateToken(at)))) {
  //       this.TOKEN = at;
  //     } else {
  //       let rt = this.cookieService.getValue(CookieType.refreshToken);
  //       if (rt && (await firstValueFrom(this.http.validateToken(rt)))) {
  //         let req = this.http.refreshToken(rt).pipe(
  //           catchError((error) => {
  //             return of(error);
  //           })
  //         );

  //         this.TOKEN = await firstValueFrom(req);
  //         this.cookieService.addToCookie(CookieType.accessToken,this.TOKEN)
  //       } else {
  //         this.router.navigate(["/login"]);
  //       }
  //     }
  //   }
  //   return this.TOKEN
  // }

  // updateAccessToken(token:string) {

  // }
}
