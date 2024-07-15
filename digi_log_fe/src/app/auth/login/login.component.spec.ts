import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CookieService } from '../../services/cookie.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpService: HttpService;
  let authService: AuthService;
  let mockLoginReturn:{refresh:string, access:string, uname:string};
  // let formBuilder: FormBuilder;
  // let router: Router;
  // let location: Location;
  // let cookieService: CookieService;

  beforeEach(() => {
    mockLoginReturn = { refresh: 'test', access: 'test', uname: 'test' };
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: Router, useValue: {} },
        {
          provide: HttpService,
          useValue: {
            login: jest
              .fn()
              .mockReturnValue(
                of(mockLoginReturn)
              ),
          },
        },
        AuthService
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpService = TestBed.inject(HttpService);
    authService = TestBed.inject(AuthService);
    // formBuilder = TestBed.inject(FormBuilder);
    // router = TestBed.inject(Router);
    // location = TestBed.inject(Location);
    // cookieService = TestBed.inject(CookieService);
  });

  it('should create LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm with empty username and password', () => {
    expect(component.loginForm.value).toEqual({ username: '', password: '' });
  });

  it('should call login method', () => {
    jest.spyOn(authService, 'updateLoggedInAs');
    jest.spyOn(httpService, 'login');

    component.loginForm.patchValue({
      username: mockLoginReturn.uname,
      password: 'test',
    });
    component.login();
    expect(authService.updateLoggedInAs).toHaveBeenCalledWith(mockLoginReturn.uname);
    expect(httpService.login).toHaveBeenCalled();
  });

  // Add more test cases as needed

});