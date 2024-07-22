import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormBuilder } from '@angular/forms';
import { RPerson } from '../../interfaces';
import { of } from 'rxjs';
import { providers } from '../../app.providers';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockFormPerson: RPerson = {
    username: 'test_user',
    password: 'test_pass',
    first_name: 'test_first',
    last_name: 'test_last',
    email: 'test_@test.com',
  };
  let httpService: HttpService;
  let mockReturnPerson: RPerson = RPerson.fromObj(mockFormPerson);

  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [],
      providers: [
        ...providers,
        { provide: Router, useValue: { navigate: jest.fn() } },
        FormBuilder,
        {
          provide: HttpService,
          useValue: {
            signup: jest.fn().mockReturnValue(of(mockReturnPerson)),
            openSnackbar: jest.fn(),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpService = TestBed.inject(HttpService);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('to be invalid with invalid input', () => {
    expect(component.signupForm.invalid).toBeTruthy();

  })
  
  it('should call signup function', () => {
    jest.spyOn(httpService, 'signup');
    component.signupForm.setValue({
      username: mockFormPerson.username,
      password: mockFormPerson.password,
      confirmPassword: mockFormPerson.password,
      first_name: mockFormPerson.first_name,
      last_name: mockFormPerson.last_name,
      email: mockFormPerson.email,
    });
    component.signup();
    expect(httpService.signup).toHaveBeenCalledWith(mockFormPerson);
  });

  // TODO: implement actual function
  it('should not accecpt different passwords', () => {
    component.signupForm.setValue({
      username: mockFormPerson.username,
      password: mockFormPerson.password,
      confirmPassword: mockFormPerson.password+"_invalid",
      first_name: mockFormPerson.first_name,
      last_name: mockFormPerson.last_name,
      email: mockFormPerson.email,
    });

    // expect(component.onSubmit).toHaveBeenCalledTimes(1);
    expect(component.signupForm.invalid).toBeTruthy();
    expect(component.signupForm.controls.confirmPassword.invalid).toBeTruthy();
    expect(component.signupForm.controls.confirmPassword.getError('PasswordNoMatch')).toBeTruthy();
  })


});