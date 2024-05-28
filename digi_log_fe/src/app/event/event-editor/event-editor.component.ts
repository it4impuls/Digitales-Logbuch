import { Component, OnInit } from '@angular/core';
import { ICourse, Course, Level, Person, PostCourse, Attendee, CookieType } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Time } from '@angular/common';
import { LogService } from '../../services/log.service';
import { CookieService } from '../../services/cookie.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

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
    private http: HttpService,
    private formbuilder: FormBuilder,
    private log: LogService,
    private cookieService: CookieService,
    private httpService: HttpService,
    public auth: AuthService
  ) {}
  edit = false;
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
  attendees:string[] = [];

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
        this.course = new Course();
      }
      this.init_course()
      
    }
  }

  init_course(){
    if (this.course) {
      this.attendees = this.course.attendees.map(
        (attendee) => attendee.attendee.username
      );
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
        description_short: this.course.description_short,
        content_list: [this.course.content_list, [Validators.required]],
        methods: this.course.methods,
        material: this.course.material,
        dates: this.course.dates,
        duration: this.course.duration,
      });
      this.uname = this.course.host.username;
      console.log(this.courseForm);
    }
  }

  getCourse(): PostCourse {
    let _course = this.courseForm.getRawValue();
    return PostCourse.fromObj({
      id: _course.id as number,
      attendees: [] as Attendee[], //Object.keys(_course.attendees).map(key:number=> this.course.attendees[key]),
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

    Object.keys(at).forEach((key) => {
      let value = at[key];
      let found = a.find((_at) => _at.id.toString() == key);
      if (found) {
        found.attends = value as boolean;
        attendees.push(found);
      }
    });
    let course: PostCourse = PostCourse.fromObj({
      id: _course.id as number,
      attendees: attendees ?? ([] as Attendee[]), //Object.keys(_course.attendees).map(key:number=> this.course.attendees[key]),
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
    console.log(await this.httpService.updateCourse(pCourse));
  }

  async signup() {
    let l = await firstValueFrom(this.httpService.courseSignup(this.getCourse().id))
    if(l){
      this.course.attendees.push(l);
      console.log(l)
      this.init_course()
    };
  }
}
