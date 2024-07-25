import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { noop } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit {
  title = 'digi_log_fe';
  constructor(
    public authService: AuthService,
    private http: HttpService,
    private router: Router
  ) {
    noop
  }

  ngOnInit(): void {
    this.authService.refreshTokens();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  getUser() {
    this.http.getUser();
  }

  login() {
    // this.router.
  }
  refresh() {
    this.authService;
  }
}
