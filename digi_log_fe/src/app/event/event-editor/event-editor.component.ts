import { Component, OnInit } from '@angular/core';
import { ICourse, Course, Person, PostCourse, Attendee } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Time } from '@angular/common';
import { LogService } from '../../services/log.service';

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
    private log: LogService
  ) {}

  course: Course = new Course();
  // time:string = "10:00"
  courseForm = this.formbuilder.group({
    id: 0,
    attendees: this.formbuilder.group({}),
    title: ['', [Validators.required]],
    qualification: '',
    level: ['I' as 'I' | 'II' | 'III', [Validators.required]],
    requirements: '',
    description_short: '',
    content_list: ['', [Validators.required]],
    methods: '',
    material: '',
    dates: '',
    duration: '',
  });
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
      this.log.log(this.course);
      if (this.course) {
        let attendees_list = Object.fromEntries(this.course.attendees.map(attendee =>[attendee.id as number, attendee.attends]));
        console.log(attendees_list);
        console.log(this.course.attendees);
        this.courseForm = this.formbuilder.group({
          id: this.course.id,
          attendees: this.formbuilder.group(attendees_list),
          qualification: this.course.qualification,
          level: [
            this.course.level as 'I' | 'II' | 'III',
            [Validators.required],
          ],
          title: [this.course.title, [Validators.required]],
          requirements: this.course.requirements,
          description_short: this.course.description_short,
          content_list: [this.course.content_list, [Validators.required]],
          methods: this.course.methods,
          material: this.course.material,
          dates: this.course.dates,
          duration: this.course.duration,
        });
      }
    }
  }

  onSubmit() {
    let a = this.course.attendees
    let _course = this.courseForm.value;
    let attendees = [] as Attendee[]

    // mapping is not enough since it is theoretically possible for a key not having an attendee
    Object.keys(_course.attendees ? _course.attendees : {}).forEach(
      (key) => {
        let found = a.find((at) => at.id.toString() == key)
        if (found){
          attendees.push(found)
        }
      }
    );
    let course: PostCourse = PostCourse.fromObj({
      id: _course.id as number,
      attendees: attendees??[] as Attendee[], //Object.keys(_course.attendees).map(key:number=> this.course.attendees[key]),
      qualification: _course.qualification as string,
      title: _course.title as string,
      level: _course.level as 'I' | 'II' | 'III',
      requirements: _course.requirements as string,
      description_short: _course.description_short as string,
      content_list: _course.content_list as string,
      methods: _course.methods as string,
      material: _course.material as string,
      dates: _course.dates as string,
      duration: _course.duration as string,
    });
    let pCourse = PostCourse.fromObj(course as PostCourse);
    
    this.log.log("course");
    this.log.log(course);
    this.log.log("_course");
    this.log.log(_course)
    this.log.log('pCourse');
    this.log.log(pCourse);

  }
}
