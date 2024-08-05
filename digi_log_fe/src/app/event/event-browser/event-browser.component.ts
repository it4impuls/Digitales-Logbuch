import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { MatTableDataSource } from "@angular/material/table";
import { LogService } from '../../services/log.service';
import { Course } from '../../interfaces';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface CourseDatasource{
  id: typeof Course.prototype.id;
  title: typeof Course.prototype.title;
  host: typeof Course.prototype.host.first_name;
  description: typeof Course.prototype.description_short;
}

@Component({
  selector: 'app-event-browser',
  templateUrl: './event-browser.component.html',
  styleUrl: './event-browser.component.less',
})
export class EventBrowserComponent implements OnInit {
  constructor(
    private http: HttpService,
    private log: LogService,
    private router: Router,
    public auth: AuthService
  ) {  }

  

  events: Course[] = [];
  dataSource: MatTableDataSource<CourseDatasource> = new MatTableDataSource();
  displayedColumns = ['name', 'host', 'description'];

  ngOnInit() {
    
    this.init();
  }

  async init():Promise<Course[]> {
    this.events = await this.http.getEvents();
    this.dsFromCourses(this.events);
    // this.log.log(this.events as Course[]);
    return this.events;
  }

  onSelectClick(event: Course) {
    this.log.log('Clicked: ' + event.id);
    this.router.navigate(["event",event.id]);
  }

  trackById(index: any, tracked: any) {
    return tracked.id;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  dsFromCourses(courses: Course[]) {
    this.dataSource = new MatTableDataSource<CourseDatasource>(
      courses.map((c) => ({ 
        id: c.id,
        title: c.title, 
        host: c.host.first_name + ' ' + c.host.last_name, 
        description: c.description_short 
      }))
    );
  }
}
