import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { MatTableDataSource } from "@angular/material/table";
import { LogService } from '../../services/log.service';
import { Course } from '../../interfaces';

@Component({
  selector: "app-event-browser",
  templateUrl: "./event-browser.component.html",
  styleUrl: "./event-browser.component.less",
})
export class EventBrowserComponent implements OnInit {
  constructor(private http: HttpService, private log: LogService) {}

  events: Course[] = [];
  dataSource: MatTableDataSource<Course> = new MatTableDataSource();
  displayedColumns = ["name", "host", "description", "atendees"];

  ngOnInit() {
    this.init();
  }

  async init() {
    this.events = await this.http.getEvents();
    this.dataSource = new MatTableDataSource<Course>(this.events);
    this.log.log(this.events as Course[]);
    this.log.log(this.events[0].id);
  }

  onSelectClick(event: Course) {}

  trackById(index: any, tracked: any) {
    return tracked.id;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
