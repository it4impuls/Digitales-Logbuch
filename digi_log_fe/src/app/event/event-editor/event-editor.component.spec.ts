import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventEditorComponent } from './event-editor.component';
import { HttpService } from '../../services/http.service'; // Import HttpService or provide a mock
import { ActivatedRoute, convertToParamMap, Router, RouterModule } from '@angular/router';
import { Course, Level, Person } from '../../interfaces';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('EventEditorComponent', () => {
  let component: EventEditorComponent;
  let fixture: ComponentFixture<EventEditorComponent>;
  let httpService: HttpService;
  let route: ActivatedRoute;
  let router: Router;
  let mockCourse: Course;
  let mockUser: Person;

  beforeEach(async () => {
    mockUser = new Person(1, 'Test', 'User');
    mockCourse = new Course(1, mockUser, [], '', 'Test Event', Level.II);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      declarations: [EventEditorComponent],
      providers: [
        HttpService,
        provideAnimationsAsync('noop'),
        provideAnimationsAsync(),
      ],
    }).compileComponents();
    httpService = TestBed.inject(HttpService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EventEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize the courseForm with default values', () => {
    jest.spyOn(route.snapshot.paramMap, 'get')
      .mockReturnValue("0");
    jest.spyOn(route.snapshot.paramMap, 'has').mockReturnValue(true);
    let defaultCourse = new Course()

    Object.keys(defaultCourse).forEach((key: string) => {
      if (key !== 'host' && key !== 'attendees') {
        expect(Object.values(defaultCourse)).toContainEqual(
          component.courseForm.get(key)?.value
        );
      }
      
    });
  });

  it('should update the course when id is not 0', async () => {
    jest.spyOn(httpService, 'getEvent')
      .mockResolvedValue(mockCourse);

    jest.spyOn(httpService, 'getUser')
      .mockResolvedValue(mockUser);

    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(mockCourse.id.toString());
    jest
      .spyOn(route.snapshot.paramMap, 'has')
      .mockReturnValue(true);

    await component.init();

    expect(component.course).toEqual(mockCourse);
    expect(component.attendees).toEqual(
      mockCourse.attendees.map((attendee) => attendee.attendee.username)
    );
    expect(httpService.getEvent).toHaveBeenCalledWith(mockCourse.id);
    // expect(httpService.getUser).toHaveBeenCalled();
  });

  it('should create a new course when id is 0', async () => {
    jest.spyOn(httpService, 'getUser').mockResolvedValue(mockUser);
    jest.spyOn(httpService, 'createCourse').mockResolvedValue(mockCourse);
    

    await component.init();

    expect(component.course.id).toEqual(0);
    expect(component.course.host.id).toEqual(0);
  });

  it('should submit the form and create a new course', async () => {
    jest.spyOn(httpService, 'createCourse').mockResolvedValue(mockCourse);
    jest.spyOn(route.snapshot.paramMap, 'get')
      .mockReturnValue("0");
    jest.spyOn(route.snapshot.paramMap, 'has')
      .mockReturnValue(true);
    jest.spyOn(router, 'navigate')
    jest.spyOn(httpService, 'openSnackbar').mockReturnValue()
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

  // Add more test cases for other methods and scenarios
});
