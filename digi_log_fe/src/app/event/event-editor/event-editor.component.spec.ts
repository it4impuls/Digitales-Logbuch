import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEditorComponent } from './event-editor.component';
import { HttpService } from '../../services/http.service'; // Import HttpService or provide a mock
import { ActivatedRoute, Router } from '@angular/router';
import { Attendee, Course, Level, Person } from '../../interfaces';
import { providers } from '../../app.providers';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

describe('EventEditorComponent', () => {
  let component: EventEditorComponent;
  let fixture: ComponentFixture<EventEditorComponent>;
  let httpService: HttpService;
  let authService: AuthService;
  let route: ActivatedRoute;
  let router: Router;
  let mockCourse: Course;
  let mockUser: Person;

  beforeEach(async () => {
    mockUser = new Person(1, 'Test', 'User', '', 'MockUname');
    mockCourse = new Course(1, mockUser, [], '', 'Test Event', Level.II);

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [EventEditorComponent],
      providers: [
        ...providers,
        FormBuilder,
        {provide: AuthService, useValue: {loggedInAs: mockUser.username}},
        {
          provide: HttpService,
          useValue: {
            getEvent: jest.fn().mockResolvedValue(mockCourse),
            getUser: jest.fn().mockResolvedValue(mockUser),
            createCourse: jest.fn().mockResolvedValue(mockCourse),
            updateCourse: jest.fn().mockResolvedValue(mockCourse),
            remCourse: jest.fn().mockReturnValue(of(null)),
            courseUnattend: jest.fn().mockReturnValue(of(null)),
            openSnackbar: jest.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: mockCourse.id.toString() },
              paramMap: {
                has: jest.fn().mockReturnValue(true),
                get: jest.fn().mockReturnValue(0),
              },
            },
          },
        },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    httpService = TestBed.inject(HttpService);
    authService = TestBed.inject(AuthService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EventEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the courseForm with default values', () => {
    let defaultCourse = new Course()
    

    expect(component.courseForm.value).toBeTruthy();
    Object.keys(defaultCourse).forEach((key: string) => {
      if (key !== 'host' && key !== 'attendees') {
        expect(Object.values(defaultCourse)).toContainEqual(
          component.courseForm.get(key)?.value
        );
      }
      
    });
  });

  it('should update the course when id is not 0', async () => {
    jest.spyOn(httpService, 'getEvent');
    jest.spyOn(httpService, 'getUser');
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(mockCourse.id.toString());

    await component.init();

    expect(component.course).toEqual(mockCourse);
    expect(component.attendees).toEqual(
      mockCourse.attendees.map((attendee) => attendee.attendee.username)
    );
    expect(httpService.getEvent).toHaveBeenCalledWith(mockCourse.id);
  });

  it('should create a new course when id is 0', async () => {
    jest.spyOn(httpService, 'getUser');
    jest.spyOn(httpService, 'createCourse');
    

    expect(component.course.id).toEqual(0);
    expect(component.course.host.id).toEqual(mockUser.id);
  });

  it('should submit the form and update the course', async () => {
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue("1");
    component.init();
    let updatedCourse = mockCourse; 
    updatedCourse.id = 1;
    updatedCourse.title = 'Updated Event';
    updatedCourse.duration = "test Duration";
    updatedCourse.description_short = "Updated Event";
    updatedCourse.dates = "test dates";
    updatedCourse.content_list = "content list";
    updatedCourse.requirements = "Updated Event requirements";

    jest.spyOn(httpService, 'updateCourse').mockResolvedValue(updatedCourse);
    jest.spyOn(router, 'navigate');
    jest.spyOn(httpService, 'openSnackbar');
    
    component.courseForm.patchValue({
      id: updatedCourse.id,
      title: updatedCourse.title,
      level: updatedCourse.level,
      duration: updatedCourse.duration,
      requirements: updatedCourse.requirements,
      description_short: updatedCourse.description_short,
      dates: updatedCourse.dates,
      content_list: updatedCourse.content_list,
    });

    expect(component.courseForm.valid).toBeTruthy();
    
    await component.onSubmit();

    expect(component.course).toEqual(updatedCourse);
    expect(httpService.updateCourse).toHaveBeenCalled();
    // expect(component.init).toHaveBeenCalled();
  });

  it('should submit the form and create a new course', async () => {
    jest.spyOn(httpService, 'createCourse').mockResolvedValue(mockCourse);
    jest.spyOn(router, 'navigate')
    jest.spyOn(httpService, 'openSnackbar')
    // jest.spyOn(component, 'init').mockResolvedValue(null);

    component.courseForm.patchValue({
      title: mockCourse.title,
      level: mockCourse.level,
      // Add more form values as needed
    });

    await component.onSubmit();
    
    expect(component.course).toEqual(mockCourse);
    expect(router.navigate).toHaveBeenCalledWith(['/event/'+mockCourse.id]);
    // expect(component.init).toHaveBeenCalled();
  });

  it('should remove attendee when removeAttendee is called', () => {
    jest.spyOn(component, 'unAttend');
    jest.spyOn(httpService, 'courseUnattend');
    // jest.spyOn(authService, 'loggedInAs');
    const mockAttendee = { id: 1, attendee: mockUser, attends: true } as Attendee;

    expect(authService.loggedInAs).toBe(mockUser.username);
    component.course.attendees = [mockAttendee];
    component.init_course()
    expect(component.attendees.find((a) => a === mockUser.username)).toEqual(
      mockUser.username
    );
    expect(component.course.attendees).toContain(mockAttendee);
    
    component.unAttend();

    expect(httpService.courseUnattend).toHaveBeenCalledWith(mockUser.id);
    expect(component.attendees.find((a) => a === mockUser.username)).toBe(
      undefined
    );
    expect(component.course.attendees).not.toContain(mockAttendee);
  });

  it('should remove course if user is host', () => {
    jest.spyOn(component, 'unAttend');
    jest.spyOn(httpService, 'remCourse');
    jest.spyOn(window, "confirm").mockReturnValue(true);
    

    expect(authService.loggedInAs).toBe(mockUser.username);
    component.course.host = mockUser;
    component.init_course()
    expect(component.course.host).toEqual(mockUser);
    component.remCourse();
    expect(httpService.remCourse).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    
  })

  // Add more test cases for other methods and scenarios
});
