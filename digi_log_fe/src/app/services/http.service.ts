import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../environments/environment";
import { Course } from "../interfaces";
// import {  } from "app/interfaces";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {}

  baseURL = `http://${environment.BACKEND_IP}:${environment.BACKEND_PORT}/api/`


  getPosts(url: string): Observable<any> {
    return this.httpClient.get<any>(url).pipe(
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

  deletePosts(url: string): Observable<any> {
    return this.httpClient.delete<any>(url).pipe(
      catchError((err) => {
        this.openSnackbar(err.message);
        return of(err);
      })
    );
  }

  async getEvents(): Promise<Course[]>{
    return firstValueFrom(this.getPosts(this.baseURL + "events"))
  }


  private openSnackbar(msg: string, dismiss: string = "OK") {
    console.log(msg);
    if (msg) {
      let snackBarRef = this.snackBar.open(msg, dismiss);
    }
  }
}
