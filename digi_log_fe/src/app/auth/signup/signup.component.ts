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
  return control.value === control.parent?.value.confirmPassword
    ? null
    : { PasswordNoMatch: true };
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.less',
})
export class SignupComponent {
  constructor(
    private http: HttpService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

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

  signup() {
    console.log('signup called');
    let form = this.signupForm.value;
    if (form.password == form.confirmPassword) {
      this.http.signup(RPerson.fromObj(form as RPerson)).subscribe({
        next: (user) => {
          this.snackBar.open('Konto erfolgreich erstellt', 'ok');
          this.router.navigate(['login/']);
        },
        error: (err) => {
          this.snackBar.open('err');
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
