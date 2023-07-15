import { CoursesService } from "./courses.service";
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { COURSES, LESSONS, findCourseById, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";
import { Lesson } from "../model/lesson";

describe("CoursesService", () => {
	let coursesService: CoursesService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule
			],
			providers: [
				CoursesService,
				// {
				//     provide: '',
				//     useValue: ''
				// }
			]
		});
		coursesService = TestBed.inject(CoursesService);
		httpTestingController = TestBed.inject(HttpTestingController);
	})

	it("should retrieve all courses", () => {
		coursesService.findAllCourses()
			.subscribe(courses => {
				expect(courses).toBeTruthy("No courses returned");
				expect(courses.length).toBe(12, "incorrect number of courses");
				const course = courses.find(course => course.id === 12);
				expect(course.titles.description).toBe("Angular Testing Course", "Invalid course description");
			});

		const req = httpTestingController.expectOne("/api/courses");
		expect(req.request.method).toEqual("GET", "Invalid method");

		req.flush({
			payload: Object.values(COURSES)
		});
	});

	it("should find a course by id", () => {
		const result: Course = findCourseById(12);

		coursesService.findCourseById(result.id)
			.subscribe(course => {
				expect(course).toBeTruthy("Course not found");
				expect(course.id).toEqual(result.id, "Invalid Course");
				expect(course.titles.description).toBe(result.titles.description, "Invalid course description");
			});

		const req = httpTestingController.expectOne(`/api/courses/${result.id}`);
		expect(req.request.method).toEqual("GET");

		req.flush(result);
	});

	it("save course data", () => {
		const changes: Partial<Course> = {
			titles: {
				description: "Testing Course"
			}
		}
		const result: Course = {
			...findCourseById(12),
			...changes
		}

		coursesService.saveCourse(result.id, changes)
			.subscribe(course => {
				expect(course).toBeTruthy("Course not returned");
				expect(course.id).toEqual(result.id, "Invalid course");
				expect(course.titles.description).toEqual(changes.titles.description, "Invalid course");
			});

		const req = httpTestingController.expectOne(`/api/courses/${result.id}`);
		expect(req.request.method).toEqual("PUT");
		expect(req.request.body.titles.description).toEqual(changes.titles.description);

		req.flush(result);
	});

	it("should return error when save course fails", () => {
		const changes: Partial<Course> = {
			titles: {
				description: "Testing Course"
			}
		}

		coursesService.saveCourse(1001, changes)
			.subscribe(() => {
				fail("should have returned error");
			}, (error: HttpErrorResponse) => {
				expect(error).toBeTruthy();
				expect(error.status).toEqual(500);
				expect(error.statusText).toEqual("Internal Server Error");
			});

		const req = httpTestingController.expectOne(`/api/courses/1001`);
		expect(req.request.method).toEqual("PUT");
		expect(req.request.body.titles.description).toEqual(changes.titles.description);

		req.flush("Error", {
			status: 500,
			statusText: "Internal Server Error"
		});
	});

	it("should retrieve lessons", () => {
		const courseID = 12;
		const result: Lesson[] = findLessonsForCourse(12);

		coursesService.findLessons(courseID)
			.subscribe(lessons => {
				expect(lessons).toBeTruthy();
				expect(Object.values(lessons).length).toEqual(3);
			});

		const req = httpTestingController.expectOne(req => req.url === "/api/lessons");
		expect(req.request.method).toEqual("GET");
		expect(req.request.params.get("courseId")).toEqual(courseID.toString());
		expect(req.request.params.get("filter")).toEqual("");
		expect(req.request.params.get("sortOrder")).toEqual("asc");
		expect(req.request.params.get("pageNumber")).toEqual("0");
		expect(req.request.params.get("pageSize")).toEqual("3");
		req.flush({
			payload: result.splice(0, 3)
		});
	})

	afterEach(() => {
		httpTestingController.verify();
	});
});