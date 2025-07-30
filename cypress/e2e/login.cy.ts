describe('Login page', () => {
    const baseUrl = '/';

    beforeEach(() => {
        cy.visit(baseUrl);
    });

    it('Loads login page', () => {
        cy.get('h5').should('contain.text', 'Login');
    });

    it('Successful login', () => {
        cy.login('inst01', 'Instructor One', 'instructor01@example.com', ['teacher']);
        cy.visit('/');
        cy.get('a[href$="/logout"]').should('contain', 'inst01');
    });

    it('Successful logout', () => {
        cy.login('inst01', 'Instructor One', 'instructor01@example.com', ['teacher']);
        cy.visit('/');
        cy.get('a[href$="/logout"]').should('contain', 'inst01');
        cy.logout();
    });
});
