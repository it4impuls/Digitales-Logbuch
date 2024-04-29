import { Component, OnInit } from '@angular/core';
import { Appointment, Course, Person } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Time } from '@angular/common';
import { LogService } from '../../services/log.service';

@Component({
  selector: "app-event-editor",
  templateUrl: "./event-editor.component.html",
  styleUrl: "./event-editor.component.less",
})
export class EventEditorComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private formbuilder: FormBuilder,
    private log: LogService,
  ) {}

  course: Course = new Course();
  // time:string = "10:00"
  courseForm = this.formbuilder.group({
    id: 0,
    name: "neuer Kurs",
    description: "",
    host: new Person(),
    atendees: [] as Person[],
  });
  ngOnInit(): void {
    this.init();
  }

  async init() {
    // console.log(this.route.snapshot.paramMap);
    if (this.route.snapshot.paramMap.has("id")) {
      let id = Number(this.route.snapshot.paramMap.get("id"));
      let fc = this.courseForm.controls;
      
      this.course = await this.http.getEvent(id);
      if (this.course) {
        this.courseForm = this.formbuilder.group({
          id: this.course.id,
          name: this.course.name,
          description: this.course.description,
          host: this.course.host,
          atendees: this.course.atendees,
          
        });
      }
    }
  }

  onSubmit() {}
}
