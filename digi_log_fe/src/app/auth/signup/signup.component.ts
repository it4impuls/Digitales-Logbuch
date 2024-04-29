import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.password === control.value.confirmPassword
    ? null
    : { PasswordNoMatch: true };
};

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrl: "./signup.component.less",
})
export class SignupComponent {
  constructor(
    private http: HttpService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
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
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    },
    { validators: confirmPasswordValidator }
  );
  error = "";

  async login() {
    // this.signupForm.
    HttpService;
    let res = this.http.login(
      this.signupForm.controls.username.value ?? "",
      this.signupForm.controls.password.value ?? ""
    );

    res.subscribe({
      next: (data) => {
        console.log(data);
        this.auth.TOKEN = data["access"];
        // this.router.
      },
      error: (e) => {
        console.error(e);
        switch (e.status) {
          case 400:
            this.error = "Bad request";
            break;
          case 401:
            this.error = "Falscher Benutzername/Kennwort";
            break;
          default:
            this.error = e.message;
        }
      },
    });
  }

  signup() {
    console.log(this.signupForm.errors)
  }
}
