import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../environments/environment";
import { Attendee, Course, ICourse, Person, PostCourse, RPerson } from "../interfaces";

interface LoginResponse {
  refresh:string;
  access: string;
  uname:string;
}

interface RefreshTokenResponse {
  access:string
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar
  )
  {}

  baseURL = `http://${environment.BACKEND_IP}:${environment.BACKEND_PORT}/api/`;

  getPosts<T>(url: string, headers = new HttpHeaders()): Observable<T> {
    return this.httpClient.get<T>(url, { headers: headers }).pipe(
        catchError((err) => {
          this.openSnackbar(err.message);
          return throwError(() => new Error(err));
        })
      );
  }

  patchPosts<T>(url: string, body: Object): Observable<T> {
    return this.httpClient
      .patch<any>(url, body, { withCredentials: true })
      .pipe(
        catchError((err) => {
          this.openSnackbar(err.message);
          return throwError(() => new Error(err));
        })
      );
  }

  postPosts<T>(url: string, body: Object): Observable<T> {
    let req = this.httpClient
      .post<any>(url, body, { withCredentials: true })
      .pipe(
        catchError((err) => {
          this.openSnackbar(err.message);
          return throwError(() => new Error(err));
        })
      );
    return req;
  }

  deletePosts<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(url, { withCredentials: true })
  }

  async getEvents(): Promise<Course[]> {
    return (
      await firstValueFrom(this.getPosts<ICourse[]>(this.baseURL + 'courses'))
    ).map((course) => Course.fromICourse(course));
  }

  async getEvent(id: number): Promise<Course> {
    let c = await firstValueFrom(
      this.getPosts<Course>(this.baseURL + 'courses/' + id)
    );
    return Course.fromObj(c);
  }

  remCourse(id:number) {
    return this.deletePosts(this.baseURL + 'courses/' + id +"/")
  }

  async updateAttending(ID: number, attending:boolean) {
    return firstValueFrom(
      this.patchPosts<Attendee>(this.baseURL + 'attendees/' + ID + '/', {
        attends: attending,
      })
    );
  }

  login(uname: string, passwd: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      this.baseURL + 'token/',
      { username: uname, password: passwd },
      { withCredentials: true }
    ).pipe(
      catchError((e)=>{
        console.error(e);
        switch (e.status) {
          case 400:
            this.openSnackbar('Bad request');
            break;
          case 401:
            this.openSnackbar('Falscher Benutzername/Kennwort');
            break;
          default:
            this.openSnackbar(e.message);
        }
        return throwError(() => new Error(e));
      })
    );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    return this.httpClient.get<LoginResponse>(
      this.baseURL + 'token/refresh/',
      { withCredentials: true }
    );
  }

  validateToken(token: string): Observable<Object> {
    return this.httpClient.post<LoginResponse>(
      this.baseURL + 'token/validate/',
      { token: token },
      {}
    );
  }

  getUser() {
    return firstValueFrom(
      this.httpClient.get<Person>(
        this.baseURL + 'getUser/',
        { withCredentials: true }
      )
    );
  }

  logout() {
    return this.httpClient
      .post(this.baseURL + 'logout/', {}, { withCredentials: true })
  }

  signup(user: RPerson) {
    return this.httpClient.post(this.baseURL + 'users/', user);
  }

  async createCourse(course: PostCourse) {
    return firstValueFrom(
      this.postPosts<Course>(
        this.baseURL + 'courses/',
        course
      )
    );
  }

  async updateCourse(course: PostCourse) {
    return firstValueFrom(
      this.patchPosts<Course>(
        this.baseURL + 'courses/' + course.id + '/',
        course
      )
    );
  }

  courseSignup(courseID: number){
    return this.postPosts<Attendee>(this.baseURL + 'attendees/', {
      'course': courseID,
    });
  }

  courseUnattend(attID: number):Observable<any>{
    return this.deletePosts(this.baseURL + 'attendees/' + attID)
  }

  openSnackbar(msg: string, dismiss: string = 'OK') {
    console.log(msg);
    if (msg) {
      let snackBarRef = this.snackBar.open(msg, dismiss);
      setTimeout(() => {
        snackBarRef.dismiss();
      }, 5000);
      
    }
  }

}
