import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from './http.service';
import { ICourse, Course } from '../interfaces';

describe('HttpService', () => {
  let service: HttpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService, MatSnackBar],
    });
    service = TestBed.inject(HttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request', () => {
    const testData = { message: 'This is a test' };

    service.getPosts('/test').subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('/test');
    expect(req.request.method).toBe('GET');

    req.flush(testData);
  });

  it('should make a PATCH request', () => {
    const testData = { message: 'This is a test' };

    service.patchPosts('/test', {}).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('/test');
    expect(req.request.method).toBe('PATCH');

    req.flush(testData);
  });

  it('should make a POST request', () => {
    const testData = { message: 'This is a test' };

    service.postPosts('/test', {}).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('/test');
    expect(req.request.method).toBe('POST');

    req.flush(testData);
  });

  it('should make a DELETE request', () => {
    const testData = { message: 'This is a test' };

    service.deletePosts('/test').subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('/test');
    expect(req.request.method).toBe('DELETE');

    req.flush(testData);
  });

  // it('should get events', async () => {
  //   const testData = [new Course(1), new Course(2)];

  //   const response = await service.getEvents();
  //   expect(response).toEqual(testData);
  // });

  // it('should get a single event', async () => {
  //   const eventId = 1;
  //   const testData = { id: eventId, name: 'Event 1' };

  //   const response = await service.getEvent(eventId);
  //   expect(response).toEqual(testData);
  // });

});
