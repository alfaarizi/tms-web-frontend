describe('Group management', () => {
    const baseUrl = '/instructor/task-manager';

    beforeEach(() => {
        cy.login('inst01', 'Instructor One', 'instructor01@example.com', ['teacher']);
        cy.visit(baseUrl);
    });

    it('Loads landing page', () => {
        cy.get('#sidebarMenu').should('contain.text', 'Development of web based applications');
    });
});
