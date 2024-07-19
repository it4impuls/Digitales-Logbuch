import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { providers } from '../../app.providers';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpService: HttpService;
  let authService: AuthService;
  let mockLoginReturn:{refresh:string, access:string, uname:string};

  beforeEach(() => {
    mockLoginReturn = { refresh: 'test', access: 'test', uname: 'test' };
    TestBed.configureTestingModule({
      imports: [],
      declarations: [LoginComponent],
      providers: [
        ...providers,
        HttpService,
        AuthService,
        FormBuilder,
        Location,
        {
          provide: HttpService,
          useValue: {
            // getEvent: jest.fn().mockResolvedValue(mockCourse),
            // getUser: jest.fn().mockResolvedValue(mockUser),
            login: jest.fn().mockReturnValue(of(mockLoginReturn)),
          },
        },
        AuthService,
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpService = TestBed.inject(HttpService);
    authService = TestBed.inject(AuthService);
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