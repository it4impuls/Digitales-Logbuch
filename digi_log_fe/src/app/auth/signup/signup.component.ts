import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RPerson } from '../../interfaces';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value === control.parent?.value.password
    ? null
    : { PasswordNoMatch: true };
};

// type keys =
//   | 'username'
//   | 'email'
//   | 'first_name'
//   | 'last_name'
//   | 'password'
//   | 'confirmPassword';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.less',
})
export class SignupComponent implements AfterViewInit {
  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // checkPasswords: ValidatorFn = (
  //   group: AbstractControl
  // ): ValidationErrors | null => {
  //   let pass = group.get("password")?.value;
  //   let confirmPass = group.get("confirmPassword")?.value;
  //   return pass === confirmPass ? null : { notSame: true };
  // };

  signupForm = this.formBuilder.group(
    {
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator ]],
    }
  );

  // errors: { [key in keys | "all"]: string} = {
  //   username: '',
  //   email: '',
  //   first_name: '',
  //   last_name: '',
  //   password: '',
  //   confirmPassword: '',
  //   all: '',
  // };

  ngAfterViewInit(): void {
    // this.onchange();
    // this.error = Object.keys(this.signupForm.errors).length < 5
    //     ? Object.keys(this.signupForm.errors ?? {}).join(', ')
    //     : '';
  }

  signup() {
    let form = this.signupForm.value;
    if (form.password == form.confirmPassword) {
      let su = this.http.signup(RPerson.fromObj(form as RPerson))
      su.subscribe({
        next: (user) => {
          // this.errors.all = '';
          this.http.openSnackbar('Konto erfolgreich erstellt', 'ok');
          this.router.navigate(['login/']);
        },
        error: (err) => {
          // this.errors.all = Object.values(err.error).join(', ');
          console.error(err);
        },
      });
    }
  }

  getError(form:FormControl){
    return form.hasError('required') ? "Feld muss ausfüllt werden":
      form.hasError('minlength') ? `Feld muss mindestens ${form.getError('minlength')["requiredLength"]} buchstaben haben`:
      form.hasError('email') ? "E-Mail Adresse nicht gültig":
      form.hasError('PasswordNoMatch') ? "Passwörter müssen übereinstimmen": 
      "unbekannter Fehler";
      
  }
}
