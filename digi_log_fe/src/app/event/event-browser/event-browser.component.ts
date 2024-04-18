import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { MatTableDataSource } from "@angular/material/table";


@Component({
  selector: "app-event-browser",
  standalone: true,
  imports: [],
  templateUrl: "./event-browser.component.html",
  styleUrl: "./event-browser.component.less",
})
export class EventBrowserComponent implements OnInit {
  constructor(private http: HttpService) {}

  events?: Event[];
  dataSource?: MatTableDataSource<Event>;

  ngOnInit() {
    this.init();
  }

  async init() {
    this.events = await this.http.getEvents();
    this.dataSource = new MatTableDataSource<Event>(this.events);
  }

  onSelectClick(event: Event) {}

  trackById(index: any, tracked: any) {
    return tracked.id;
  }
}
