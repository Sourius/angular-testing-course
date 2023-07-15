import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';
import { Course } from '../model/course';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(course => course.category == 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category == 'ADVANCED')

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);
    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{
        provide: CoursesService,
        useValue: coursesServiceSpy
      }]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });

  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(
      of(beginnerCourses)
    );
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs');

    // console.log(el.nativeElement);
    const beginnersTab = el.query(By.css('.mdc-tab__text-label'));

    // console.log(beginnersTab.nativeElement);
    expect(beginnersTab.nativeElement.innerText).toEqual('Beginners', 'Unexpected tab');
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(
      of(advancedCourses)
    );
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs');

    const beginnersTab = el.query(By.css('.mdc-tab__text-label'));
    expect(beginnersTab.nativeElement.innerText).toEqual('Advanced', 'Unexpected tab');
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(
      of(setupCourses())
    );
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(2, 'Unexpected number of tabs');

    const tabTexts = el.queryAll(
      By.css('.mdc-tab__text-label')
    ).map(elem => elem.nativeElement.innerText);

    expect(tabTexts[0]).toEqual('Beginners', 'Unexpected tab');
    expect(tabTexts[1]).toEqual('Advanced', 'Unexpected tab');
  });

  xit("should display advanced courses when tab clicked v1", (done: DoneFn) => {
    coursesService.findAllCourses.and.returnValue(
      of(setupCourses())
    );
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    // expect(tabs.length).toBe(2, 'Unexpected number of tabs');

    click(tabs[1]);
    fixture.detectChanges();

    setTimeout(() => {
      const courseTitleList = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'))
        .map(element => element.nativeElement.innerText);
      const advancedCourseTitleList = advancedCourses.map(advancedCourse => advancedCourse.titles.description);
      expect(courseTitleList).toEqual(advancedCourseTitleList, "Unknown advance courses");
      done();
    }, 500);
  });

  xit("should display advanced courses when tab clicked v2", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(
      of(setupCourses())
    );
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(2, 'Unexpected number of tabs');

    click(tabs[1]);
    fixture.detectChanges();
    // tick(500);
    flush();

    const advancedCourseTitleList = advancedCourses.map(advancedCourse => advancedCourse.titles.description);
    const courseTitleList = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'))
      .map(element => element.nativeElement.innerText);
    expect(courseTitleList).toEqual(advancedCourseTitleList, "Unknown advance courses");
  }));

  xit("should display advanced courses when tab clicked v3", () => {
    coursesService.findAllCourses.and.returnValue(
      of(setupCourses())
    );

    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(2, 'Unexpected number of tabs');

    click(tabs[1]);
    fixture.detectChanges();

    Promise.resolve(
      setTimeout(() => {
        const advancedCourseTitleList = advancedCourses.map(advancedCourse => advancedCourse.titles.description);
        const courseTitleList = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'))
          .map(element => element.nativeElement.innerText);
        expect(courseTitleList).toEqual(advancedCourseTitleList, "Unknown advance courses");
      }, 500)
    );
  });

  it("should display advanced courses when tab clicked v4", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(
      of(setupCourses())
    );

    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(2, 'Unexpected number of tabs');

    click(tabs[1]);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const advancedCourseTitleList = advancedCourses.map(advancedCourse => advancedCourse.titles.description);
      const courseTitleList = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'))
        .map(element => element.nativeElement.innerText);
      expect(courseTitleList).toEqual(advancedCourseTitleList, "Unknown advance courses");
    });

  }));
});


