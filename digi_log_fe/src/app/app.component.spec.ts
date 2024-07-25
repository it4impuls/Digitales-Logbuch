import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpService } from './services/http.service';
import { Person } from './interfaces';
import { AuthService } from './services/auth.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';

interface LoginResponse {
  refresh: string;
  access: string;
  uname: string;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let httpService: HttpService;
  let fixture: ComponentFixture<AppComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [AppComponent],
      providers: [
        provideRouter(routes),
        // {provide:Router, useValue: {navigate: jest.fn().mockReturnValue(of(true))}},
        {
          provide: HttpService,
          useValue: {
            logout: jest.fn().mockReturnValue(of(true)),
            getUser: jest.fn().mockReturnValue(of({} as Person)),
            refreshToken: jest.fn().mockReturnValue(of({} as LoginResponse)),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    httpService = TestBed.inject(HttpService);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'digi_log_fe' title`, () => {
    expect(component.title).toEqual('digi_log_fe');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.getElementsByClassName('home').item(0)?.textContent).toContain(
      'Kursbuch'
    );
  });

  it('should call refreshTokens on ngOnInit', () => {
    jest.spyOn(authService, 'refreshTokens');
    component.ngOnInit();
    expect(authService.refreshTokens).toHaveBeenCalled();
  });

  it('should call logout on logout', () => {
    jest.spyOn(authService, 'logout');
    jest.spyOn(authService, 'updateLoggedInAs');
    // jest.spyOn(router, 'navigate');
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(authService.updateLoggedInAs).toHaveBeenCalled();
    // expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call getUser on test', async () => {
    const mockPerson = new Person(1, 'John', 'Doe', 'Developer', 'johndoe');
    jest.spyOn(httpService, 'getUser').mockResolvedValue(mockPerson);

    await component.getUser();

    expect(httpService.getUser).toHaveBeenCalled();
  });

});