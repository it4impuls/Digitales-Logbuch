import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let cookieService: any;
  let httpService: any;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: CookieService,
          useValue: { getValue: jest.fn(), removeFromCookie: jest.fn() },
        },
        {
          provide: HttpService,
          useValue: { logout: jest.fn(), refreshToken: jest.fn(), openSnackbar: jest.fn() },
        },
        Router,
      ],
    });
    authService = TestBed.inject(AuthService);
    cookieService = TestBed.inject(CookieService);
    httpService = TestBed.inject(HttpService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should handle error when logout is called', () => {
    jest.spyOn(cookieService, 'removeFromCookie');
    jest.spyOn(authService, 'updateLoggedInAs');
    jest
      .spyOn(httpService, 'logout')
      .mockReturnValue(
        throwError(() => new Error('something went wrong'))
      );
    authService.logout();
    expect(httpService.logout).toHaveBeenCalled();
    expect(authService.updateLoggedInAs).toHaveBeenCalledTimes(0);
    expect(httpService.openSnackbar).toHaveBeenCalledWith(
      "Something went wrong, Couldn't log out"
    );

  });

  it('should remove username cookie and update loggedInAs when logout is called', () => {
    jest.spyOn(cookieService, 'removeFromCookie');
    jest.spyOn(authService, 'updateLoggedInAs');

    const response = {}; // Replace with the actual response object

    jest.spyOn(httpService, 'logout').mockReturnValue(of(response));

    authService.logout()

    expect(httpService.logout).toHaveBeenCalled();
    expect(authService.updateLoggedInAs).toHaveBeenCalled();
  });

  it('should handle error when refreshToken is called', () => {
    jest.spyOn(cookieService, 'removeFromCookie');
    jest.spyOn(authService, 'updateLoggedInAs');
    jest
      .spyOn(httpService, 'refreshToken')
      .mockReturnValue(of(throwError(() => new Error('something went wrong'))));
    authService.refreshTokens();
    expect(httpService.refreshToken).toHaveBeenCalled();
    expect(authService.updateLoggedInAs).toHaveBeenCalled();
  });

});