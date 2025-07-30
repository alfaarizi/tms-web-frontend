/// <reference types="cypress" />

Cypress.Commands.add('login', (userCode, name, email, roles) => {
    cy.session(
        userCode,
        () => {
            cy.visit('/');
            cy.get('input[name=userCode]').type(userCode);
            cy.get('input[name=name]').type(name);
            cy.get('input[name=email]').type(email);

            if (roles?.includes('student')) {
                cy.get('input[name=isStudent]').check();
            }
            if (roles?.includes('teacher')) {
                cy.get('input[name=isTeacher]').check();
            }
            if (roles?.includes('admin')) {
                cy.get('input[name=isAdmin]').check();
            }

            cy.get('button[type="submit"]').click();
            cy.get('a[href$="/logout"]').should('contain', userCode);
        },
        {
            validate: () => {
                assert.isNotNull(localStorage.getItem('accessToken'), 'Access token is set in local storage');
                cy.request({
                    method: 'GET',
                    url: 'backend-core/common/user-settings',
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                })
                    .its('status')
                    .should('eq', 200, 'Access token is valid');
            },
        },
    );
});

Cypress.Commands.add('logout', () => {
    cy.get('a[href$="/logout"]').click();
    cy.get('a[href$="/logout"]').should('not.exist');

    // Poll localStorage until accessToken is null
    cy.window().should((win) => {
        assert.isNull(win.localStorage.getItem('accessToken'), 'Access token is removed from local storage');
    });
});
