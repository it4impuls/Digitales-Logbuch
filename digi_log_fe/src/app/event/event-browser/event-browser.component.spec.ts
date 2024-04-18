import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBrowserComponent } from './event-browser.component';

describe('EventBrowserComponent', () => {
  let component: EventBrowserComponent;
  let fixture: ComponentFixture<EventBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventBrowserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
