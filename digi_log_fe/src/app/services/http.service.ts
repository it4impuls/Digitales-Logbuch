import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../environments/environment";
import { Course, ICourse } from "../interfaces";
// import { AuthService } from "./auth.service";
// import {  } from "app/interfaces";

interface LoginResponse {
  refresh:string;
  access: string;
  uname:string;
}

interface RefreshTokenResponse {
  access:string
}

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    // private authService: AuthService
  ) {}

  baseURL = `http://${environment.BACKEND_IP}:${environment.BACKEND_PORT}/api/`;

  getPosts<T>(url: string, headers = new HttpHeaders()): Observable<T> {
    return this.httpClient.get<T>(url, { headers: headers }).pipe(
      catchError((err) => {
        this.openSnackbar(err.message);
        return of(err);
      })
    );
  }

  patchPosts(url: string, body: Object): Observable<any> {
    return this.httpClient.patch<any>(url, body).pipe(
      catchError((err) => {
        this.openSnackbar(err.message);
        return of(err);
      })
    );
  }

  postPosts(url: string, body: Object): Observable<any> {
    return this.httpClient.post<any>(url, body).pipe(
      catchError((err) => {
        this.openSnackbar(err.message);
        return of(err);
      })
    );
  }

  deletePosts(url: string, token=""): Observable<any> {
    return this.httpClient.delete<any>(url).pipe(
      catchError((err) => {
        this.openSnackbar(err.message);
        return of(err);
      })
    );
  }

  async getEvents(): Promise<Course[]> {
    return (
      await firstValueFrom(this.getPosts<ICourse[]>(this.baseURL + "courses"))
    ).map((course) => Course.fromObj(course));
  }

  async getEvent(id: number): Promise<Course> {
    return Course.fromObj(
      await firstValueFrom(
        this.getPosts<ICourse>(this.baseURL + "courses/" + id)
      )
    );
  }

  login(uname: string, passwd: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      this.baseURL + "token/",
      { username: uname, password: passwd },
      {}
    );
  }

  refreshToken(refreshToken: string): Observable<RefreshTokenResponse> {
    return this.httpClient.post<LoginResponse>(
      this.baseURL + "token/refresh/",
      { refresh: refreshToken },
      {}
    );
  }

  validateToken(token: string): Observable<Object> {
    return this.httpClient.post<LoginResponse>(
      this.baseURL + "token/validate/",
      { token: token },
      {}
    );
  }

  postTest(){
    return firstValueFrom(
      this.httpClient.post(
        this.baseURL + "authTest/",
        {},
        { withCredentials: true }
      )
    );
  }

  async logout() {
    return await firstValueFrom(
      this.httpClient.post(this.baseURL + "logout/", {}).pipe(
        catchError((err) => {
          this.openSnackbar(err.message);
          return of(err);
        })
      )
    );
  }

  private openSnackbar(msg: string, dismiss: string = "OK") {
    console.log(msg);
    if (msg) {
      let snackBarRef = this.snackBar.open(msg, dismiss);
    }
  }

  // private getheaders(token =""): HttpHeaders {
  //   let headers = new HttpHeaders();
  //   if (token) {
  //     headers.append("Authorization", "Bearer " + token);
  //   }
  //   return headers;
  // }
}
