describe('Home Page', () => {
	beforeEach(() => {
		cy.fixture('courses.json').as('coursesJSON');
		cy.server();

		cy.route('/api/courses', '@coursesJSON').as('courses');
		cy.visit('/');

		cy.wait('@courses');
	});

	it('should display a list of course', () => {
		cy.contains('All Courses');
		cy.get('mat-card').should('have.length', 9);
	});

	it('should display advanced courses', () => {
		const tabs = cy.get('.mat-mdc-tab').should('have.length', 2);
		tabs.last().click();

		const courses = cy.get('.mat-mdc-tab-body-active .mat-mdc-card-title');
		courses.should('have.length', 3);
		courses.first().should('contain', 'Angular Security Course');
	});
})