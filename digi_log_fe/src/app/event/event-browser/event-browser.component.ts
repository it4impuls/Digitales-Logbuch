import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { MatTableDataSource } from "@angular/material/table";
import { LogService } from '../../services/log.service';
import { Course } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: "app-event-browser",
  templateUrl: "./event-browser.component.html",
  styleUrl: "./event-browser.component.less",
})
export class EventBrowserComponent implements OnInit {
  constructor(
    private http: HttpService,
    private log: LogService,
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {}

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
  }

  onSelectClick(event: Course) {
    this.log.log("Clicked: " + event.id);
    this.router.navigate([event.id], { relativeTo: this.route });
  }

  trackById(index: any, tracked: any) {
    return tracked.id;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // newCourse() {
  //   this.router.navigate(["event/new", { pathMatch: "full" }]);
  // }
}
