import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http.service';
import { AuthService } from './services/auth.service';
import { CookieService } from './services/cookie.service';
import { CookieType } from './interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit {
  title = 'digi_log_fe';
  constructor(
    private cookieService: CookieService,
    public authService: AuthService,
    private http: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.refreshTokens();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  test() {
    this.http.getUser();
  }

  login() {
    // this.router.
  }
  refresh() {
    this.authService;
  }
}
