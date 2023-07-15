import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CoursesCardListComponent } from './courses-card-list.component';
import { CoursesModule } from '../courses.module';
import { COURSES } from '../../../../server/db-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { sortCoursesBySeqNo } from '../home/sort-course-by-seq';
import { Course } from '../model/course';
import { setupCourses } from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {
	let component: CoursesCardListComponent;
	let fixture: ComponentFixture<CoursesCardListComponent>;
	let debugElement: DebugElement;

	beforeEach(waitForAsync(() => {
		const imports = [
			CoursesModule
		];
		const providers = [];
		const declarations = [];

		TestBed.configureTestingModule({
			imports: imports,
			providers: providers,
			declarations: declarations
		}).compileComponents()
			.then(() => {
				fixture = TestBed.createComponent(CoursesCardListComponent);
				component = fixture.componentInstance;
				debugElement = fixture.debugElement;
			});
	}));

	it("should create the component", () => {
		expect(component).toBeTruthy();
	});

	it("should display the course list", () => {
		component.courses = setupCourses();
		fixture.detectChanges();

		const cards = debugElement.queryAll(By.css(".c-course-card"));
		expect(cards).toBeTruthy("Could not find cards");
		expect(cards.length).toBe(12, "Unexpected number of courses");
	});


	it("should display the first course", () => {
		component.courses = setupCourses();
		fixture.detectChanges();
		const course = component.courses[0];

		const card = debugElement.query(By.css(".c-course-card:first-child"));
		const title = card.query(By.css("mat-card-title"));
		const image = card.query(By.css("img"));

		expect(card).toBeTruthy("Could not find card");
		expect(title.nativeElement.textContent).toBe(course.titles.description);
		expect(image.nativeElement.src).toBe(course.iconUrl);
	});
});
