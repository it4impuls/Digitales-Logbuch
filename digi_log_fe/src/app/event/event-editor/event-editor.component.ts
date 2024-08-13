import { Component, OnInit } from '@angular/core';
import { Course, Level, PostCourse, Attendee, Person } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LogService } from '../../services/log.service';
import {
  TranslateService,
  _,
  Translation,
} from '../../services/translate.service';


export type ModelFormGroup<T> = FormGroup<{
  [K in keyof T]: FormControl<T[K]>;
}>;

type coursekeys = keyof Course;


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
    private httpService: HttpService,
    private log: LogService,
    public auth: AuthService,
    public translate: TranslateService
  ) {}
  // public coursekeys = Object.keys(Course);
  edit = false;
  userInList = false;
  course: Course = new Course();
  courseForm = this.formbuilder.group({
    id: 0 as number,
    attendees: this.formbuilder.group({} as { [k: string]: boolean }),
    title: ['', [Validators.required]],
    qualification: '',
    level: ['I' as Level, [Validators.required]],
    host: new Person(),
    description_short: '',
    content_list: ['', [Validators.required]],
    methods: '',
    material: '',
    dates: '',
    duration: ['', [Validators.required]],
  });
  uname = '';
  attendees: string[] = [];

  public _ = _;
  public Translation = Translation;

  ngOnInit(): Promise<null> {
    return this.init();
  }

  async init() {
    if (this.route.snapshot.paramMap.has('id')) {
      let id = Number(this.route.snapshot.paramMap.get('id'));

      if (id > 0) {
        this.course = await this.http.getEvent(id);
      } else if (id == 0) {
        let user = await this.http.getUser();
        this.course = new Course();
        this.course.host = user;
        this.edit = true;
      } else {
        throw new Error('invalid id');
      }
      this.init_course();
    } else {
      throw new Error('no id');
    }

    return null;
  }

  init_course() {
    if (this.course) {
      this.log.log(this.course);
      if (
        this.auth.loggedInAs === this.course.host.username ||
        this.auth.loggedInAs === 'admin'
      ) {
        this.edit = true;
      }
      this.course.attendees.sort((a, b) => (a.attends < b.attends ? 1 : -1));
      this.attendees = this.course.attendees.map(
        (attendee) => attendee.attendee.username
      );

      this.userInList = this.attendees.includes(this.auth.loggedInAs ?? '');
      let attendees_list = Object.fromEntries(
        this.course.attendees.map((attendee) => [
          attendee.id as number,
          attendee.attends,
        ])
      );

      // .forEach((key,value) => {
      //   console.log(value.err);
      // });;

      let v = this.courseForm.controls;
      v.id.setValue(this.course.id as number);
      v.attendees.setValue(attendees_list as { [k: string]: boolean });
      v.qualification.setValue(this.course.qualification);
      v.level.setValue(this.course.level as Level);
      v.title.setValue(this.course.title);
      v.description_short.setValue(this.course.description_short);
      v.content_list.setValue(this.course.content_list);
      v.methods.setValue(this.course.methods);
      v.material.setValue(this.course.material);
      v.dates.setValue(this.course.dates);
      v.duration.setValue(this.course.duration);
      console.log(this.courseForm.value);
      console.log(this.courseForm.invalid);
      console.log(Object.entries(this.courseForm.controls));
    }
  }

  null() {}

  getCourse(): PostCourse {
    let _course = this.courseForm.getRawValue();
    return PostCourse.fromObj({
      id: _course.id as number, //Object.keys(_course.attendees).map(key:number=> this.course.attendees[key]),
      qualification: _course.qualification as string,
      title: _course.title as string,
      level: _course.level as Level,
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
        this.course = course;
        this.init_course();
      }
    }
  }

  async signup() {
    let l = await firstValueFrom(
      this.httpService.courseSignup(this.getCourse().id)
    );
    if (l && Object.keys(l).length > 0) {
      this.http.openSnackbar(
        'Erfolgreich Auf Warteliste gesetzt; Veranstalter wird in kürze informiert'
      );
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
          this.http.openSnackbar('Erfolgreich ausgetreten');
          const index = this.course.attendees.indexOf(attendee, 0);
          if (index > -1) {
            this.course.attendees.splice(index, 1);
            this.init_course();
          } else {
            console.error(
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

  async onCheck(event: MatCheckboxChange, attendee: Attendee) {
    let a = await this.http.updateAttending(attendee.id, event.checked);
  }

  async remCourse() {
    if (confirm('Wollen Sie wirklich diesen Kurs entfernen?')) {
      this.http.remCourse(this.course.id).subscribe({
        next: (response) => {
          this.http.openSnackbar('Erfolgreich entfernt');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.http.openSnackbar(error.message);
        },
      });
    }
  }

  getFormFields(): [coursekeys, FormControl | FormGroup][] {
    let keys: coursekeys[] = Object.keys(
      this.courseForm.controls
    ) as coursekeys[];
    let values = Object.values(this.courseForm.controls);
    let z: [coursekeys, FormControl | FormGroup][] = keys.map((key, index) => [
      key,
      values[index],
    ]);
    return z;
  }
}
