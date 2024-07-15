import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTableDataSource } from '@angular/material/table';
import { LogService } from '../../services/log.service';
import { EventBrowserComponent } from './event-browser.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { Course } from '../../interfaces';


describe('EventBrowserComponent', () => {
  let component: EventBrowserComponent;
  let fixture: ComponentFixture<EventBrowserComponent>;
  let httpService: HttpService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [EventBrowserComponent],
      providers: [LogService, HttpService],
    }).compileComponents();

    fixture = TestBed.createComponent(EventBrowserComponent);
    component = fixture.componentInstance;
    httpService = TestBed.inject(HttpService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize events and dataSource on ngOnInit', async () => {
    const mockEvents = [new Course(1), new Course(2)];
    const httpServiceSpy = jest
      .spyOn(httpService, 'getEvents')
      .mockResolvedValue(mockEvents);

    await component.ngOnInit();
    expect(httpServiceSpy).toHaveBeenCalled();
    expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
    expect(component.dataSource.data).toEqual(mockEvents);
    expect(component.events).toEqual(mockEvents);
  });

  it('should navigate to event details page on onSelectClick', () => {
    const mockEvent:Course = new Course (1);
    const routerSpy = jest.spyOn(router, 'navigate');

    component.onSelectClick(mockEvent);

    expect(routerSpy).toHaveBeenCalledWith(['event', mockEvent.id]);
  });

  it('should filter dataSource based on event input', () => {
    const mockEvents = [new Course(1), new Course(2)];
    component.dataSource = new MatTableDataSource(mockEvents);

    component.applyFilter({ target: { value: '1' } } as any);

    expect(component.dataSource.filter).toBe('1');
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0]).toEqual(mockEvents[0]);
  });

  it('should return the number of attendees attending an event', () => {
    const mockEvent = {
      attendees: [{ attends: true }, { attends: false }, { attends: true }],
    };

    const result = component.attending(mockEvent as any);

    expect(result).toBe(2);
  });

  it('should track by event id', () => {
    const mockEvent = { id: 1, name: 'Event 1' };

    const result = component.trackById(0, mockEvent);

    expect(result).toBe(mockEvent.id);
  });
});
