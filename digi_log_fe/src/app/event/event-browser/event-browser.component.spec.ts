import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { LogService } from '../../services/log.service';
import { EventBrowserComponent } from './event-browser.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { Course } from '../../interfaces';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('EventBrowserComponent', () => {
  let component: EventBrowserComponent;
  let fixture: ComponentFixture<EventBrowserComponent>;
  let router: Router;
  let httpService: HttpService;
  let mockEvents = [new Course(1), new Course(2)];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [EventBrowserComponent],
      providers: [
        provideAnimationsAsync(),
        LogService,
        {provide: Router, useValue: {navigate: jest.fn()}},
        {
          provide: HttpService,
          useValue: {
            getEvents: jest.fn().mockResolvedValue(mockEvents),
            openSnackbar: jest.fn(),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(EventBrowserComponent);
    component = fixture.componentInstance;
    httpService = TestBed.inject(HttpService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize events and dataSource on ngOnInit', async () => {

    await component.ngOnInit();
    expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
    expect(component.dataSource.data).toEqual(mockEvents);
    expect(component.events).toEqual(mockEvents);
  });

  it('should navigate to event details page on onSelectClick', () => {
    const mockEvents = [new Course(1), new Course(2)];
    const routerSpy = jest.spyOn(router, 'navigate');
    component.onSelectClick(mockEvents[0]);
    expect(routerSpy).toHaveBeenCalledWith(['event', mockEvents[0].id]);
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
