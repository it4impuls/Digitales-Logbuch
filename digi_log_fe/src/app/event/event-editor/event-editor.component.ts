import { Component, OnInit } from '@angular/core';
import { ICourse, Course, Level, Person, PostCourse, Attendee, CookieType } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Time } from '@angular/common';
import { LogService } from '../../services/log.service';
import { CookieService } from '../../services/cookie.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';

interface attendeesGroup {
  [x: string]: FormControl<boolean | null>;
}
export type ModelFormGroup<T> = FormGroup<{
  [K in keyof T]: FormControl<T[K]>;
}>;

interface EventFormControls {
  id: FormControl<number>;
  attendees: | attendeesGroup;
  title: FormControl<string>;
  qualification: FormControl<string>;
  age: FormControl<number>;
  level: FormControl<Level>;
  requirements: FormControl<string>;
  description_short: FormControl<string>;
  content_list: FormControl<string>;
  methods: FormControl<string>;
  material: FormControl<string>;
  dates: FormControl<string>;
  duration: FormControl<string>;
}

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrl: './event-editor.component.less',
})
export class EventEditorComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    private formbuilder: FormBuilder,
    private log: LogService,
    private cookieService: CookieService,
    private httpService: HttpService,
    public auth: AuthService
  ) {}
  edit = false;
  userInList = false;
  course: Course = new Course();
  // time:string = "10:00"
  courseForm = this.formbuilder.group({
    id: 0,
    attendees: this.formbuilder.group({} as { [k: string]: boolean | null }),
    title: ['', [Validators.required]],
    qualification: '',
    level: ['I' as Level, [Validators.required]],
    requirements: '',
    description_short: '',
    content_list: ['', [Validators.required]],
    methods: '',
    material: '',
    dates: '',
    duration: '',
  });
  uname = '';
  attendees: string[] = [];

  ngOnInit(): void {
    this.init();
  }

  async init() {
    // console.log(this.route.snapshot.paramMap);
    if (this.route.snapshot.paramMap.has('id')) {
      let id = Number(this.route.snapshot.paramMap.get('id'));

      if (id != 0) {
        this.course = await this.http.getEvent(id);
      } else {
        let user = await this.http.getUser();
        this.course = new Course();
        this.course.host = user;
      }
      this.init_course();
    }
  }

  init_course() {
    if (this.course) {
      this.attendees = this.course.attendees.map(
        (attendee) => attendee.attendee.username
      );
      this.attendees.forEach((x) => console.log(x === this.auth.loggedInAs));
      this.userInList = this.attendees.includes(this.auth.loggedInAs ?? '');
      let attendees_list = Object.fromEntries(
        this.course.attendees.map((attendee) => [
          attendee.id as number,
          attendee.attends,
        ])
      );
      this.courseForm = this.formbuilder.group({
        id: this.course.id as number,
        attendees: this.formbuilder.group(attendees_list),
        qualification: this.course.qualification,
        level: [this.course.level as Level, [Validators.required]],
        title: [this.course.title, [Validators.required]],
        requirements: this.course.requirements,
        description_short: [
          this.course.description_short,
          [Validators.required],
        ],
        content_list: [this.course.content_list, [Validators.required]],
        methods: this.course.methods,
        material: this.course.material,
        dates: [this.course.dates, [Validators.required]],
        duration: [this.course.duration, [Validators.required]],
      });
      this.uname = this.course.host.username;
      console.log(this.courseForm);
    }
  }

  getCourse(): PostCourse {
    let _course = this.courseForm.getRawValue();
    return PostCourse.fromObj({
      id: _course.id as number, //Object.keys(_course.attendees).map(key:number=> this.course.attendees[key]),
      qualification: _course.qualification as string,
      title: _course.title as string,
      level: _course.level as Level,
      requirements: _course.requirements as string,
      description_short: _course.description_short as string,
      content_list: _course.content_list as string,
      methods: _course.methods as string,
      material: _course.material as string,
      dates: _course.dates as string,
      duration: _course.duration as string,
    });
  }

  async onSubmit() {
    let a = this.course.attendees;
    let _course = this.courseForm.getRawValue();
    let attendees = [] as Attendee[];
    let at = _course.attendees;
    // mapping is not enough since it is theoretically possible for a key not having an attendee

    let course: PostCourse = PostCourse.fromObj({
      id: _course.id as number, //Object.keys(_course.attendees).map(key:number=> this.course.attendees[key]),
      qualification: _course.qualification as string,
      title: _course.title as string,
      level: _course.level as Level,
      requirements: _course.requirements as string,
      description_short: _course.description_short as string,
      content_list: _course.content_list as string,
      methods: _course.methods as string,
      material: _course.material as string,
      dates: _course.dates as string,
      duration: _course.duration as string,
    });
    let pCourse = PostCourse.fromObj(course as PostCourse);
    if (pCourse.id === 0) {
      let course = await this.httpService.createCourse(pCourse);
      this.router.navigate(['/event/' + course.id]);
      this.course = course;
      this.init_course();

      this.http.openSnackbar('Erfolgreich gespeichert');
    } else {
      let course = await this.httpService.updateCourse(pCourse);
      if (course) {
        this.http.openSnackbar('Erfolgreich gespeichert');
      }
    }
  }

  async signup() {
    let l = await firstValueFrom(
      this.httpService.courseSignup(this.getCourse().id)
    );
    if (l && Object.keys(l).length > 0) {
      this.http.openSnackbar('Erfolgreich Angemeldet');
      this.course.attendees.push(l);
      this.init_course();
    }
  }

  async unAttend() {
    const attendee = this.course.attendees.find(
      (a) => a.attendee.username === this.auth.loggedInAs
    );
    if (attendee) {
      this.httpService.courseUnattend(attendee.id).subscribe({
        next: (data) => {
          this.http.openSnackbar('Erfolgreich abgemeldet');
          const index = this.course.attendees.indexOf(attendee, 0);
          if (index > -1) {
            this.course.attendees.splice(index, 1);
            this.init_course();
          } else {
            console.log(
              'User nicht gefunden, Seite neu laden um änderung zu sehen'
            );
          }
        },
        error: (e) => {
          this.http.openSnackbar('Etwas schlug fehl!');
        },
      });
    } else {
      this.http.openSnackbar('Benutzer nicht in liste gefunden');
    }
  }

  async onCheck(event:MatCheckboxChange, attendee:Attendee) {
    let a = await this.http.updateAttending(attendee.id, event.checked)
  }

  async remCourse(){
    if( confirm("Wollen Sie wirklich diesen Kurs entfernen?")){
      this.http.delEvent(this.course.id).subscribe({
        next: (response) => {
          this.http.openSnackbar("Erfolgreich entfernt")
          this.router.navigate(["/"])
        },
        error: (error) => {this.http.openSnackbar(error.message);}
      })
    }
  }

}
