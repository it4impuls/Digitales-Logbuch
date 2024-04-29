import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RPerson } from '../../interfaces';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


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
export class SignupComponent implements OnInit {
  constructor(
    private http: HttpService,
    private auth: AuthService,
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
      username: ["", [Validators.required]],
      email: ["", [Validators.required]],
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    },
    { validators: confirmPasswordValidator }
  );
  error = "";

  ngOnInit(): void {}

  signup() {
    console.log("signup called");
    let form = this.signupForm.value;
    if (form.password == form.confirmPassword) {
      this.http.signup(RPerson.fromObj(form as RPerson)).subscribe({
        next: (user) => {
          console.log(user);
          this.error = "";
          this.snackBar.open("Konto erfolgreich erstellt", "ok");
          this.router.navigate(["login/"]);
        },
        error: (err) => {
          this.error = Object.values(err.error).join(", ");
          console.log(err);
        },
      });
    }
  }

  onchange() {
    if (this.signupForm.errors) {
      if (this.signupForm.errors["PasswordNoMatch"]) {
        this.error = "Passwörter stimmen nicht überein";
      } else {
        this.error =
          Object.keys(this.signupForm.errors).length < 5
            ? Object.keys(this.signupForm.errors ?? {}).join(", ")
            : "";
        console.log(Object.keys(this.signupForm.errors));
      }
      console.log("updated: " + this.error);
    } else {
      this.error = "";
    }
  }
}
