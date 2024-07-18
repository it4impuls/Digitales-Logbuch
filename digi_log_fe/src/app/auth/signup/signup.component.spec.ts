import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Person, RPerson } from '../../interfaces';
import { of } from 'rxjs';


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
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatSnackBar, useValue: {} },
        { provide: Router, useValue: {} },
        {
          provide: HttpService,
          useValue: {
            signup: jest.fn().mockReturnValue(of(mockReturnPerson)),
          },
        },
        { provide: AuthService, useValue: {} },
        FormBuilder,
      ],
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
    jest.spyOn(httpService, 'signup');
    jest.spyOn(component, 'signup');
    expect(component.signupForm.invalid).toBeTruthy();

  })
  
  it('should call signup function', () => {
    jest.spyOn(httpService, 'signup');
    jest.spyOn(component, 'signup');
    component.signupForm.patchValue({
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