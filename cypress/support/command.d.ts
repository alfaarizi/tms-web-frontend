declare namespace Cypress {
    type UserRole = 'student' | 'teacher' | 'admin';

    interface Chainable {
        /**
         * Custom command to authenticate with the mocked login using a session
         * @param userCode - the user's unique identifier
         * @param name - the user's name
         * @param email - the user's email address
         * @param roles - array of roles assigned to the user
         */
        login(userCode: string, name: string, email: string, roles?: UserRole[]): void;

        /**
         * Custom command to log out from the session
         */
        logout(): void;
    }
}
