Contribution Guide
==================

<abbr title="Task Management System">TMS</abbr> is an open-source project. Welcome and thank you for considering contributing to the project. Here you will find all relevant information on how to contribute to do so. Don't hesitate to contact the project *Owners* or *Maintainers* if you have questions.

You reserve all right, title, and interest in and to your contributions. All contributions are subject to the BSD License - see the [LICENSE.md](LICENSE.md) file for details.


ISSUE POLICIES
--------------

Either you are reporting a ~"Kind: Bug", making a ~"Kind: Enhancement" or plan to join the development, you should always create an issue with detailed decription to log and track the tasks and their process.

Example use cases or bug reports should never contain sensitive personal data, e.g. the grading results of a student. Always make sure the remove all sensitive personal information from the samples and screenshots you provide.


CODING GUIDELINES
-----------------

### Formatting conventions

The TypeScript codebase is written according the ECMAScript 2021 (ES 12) standard. Linting is mostly based on [Airbnb's ruleset](https://www.npmjs.com/package/eslint-config-airbnb) and [React's ruleset](https://www.npmjs.com/package/eslint-plugin-react).
Any modern IDE designed for web development, like [WebStorm](https://www.jetbrains.com/webstorm/) will auto-recognize the specified formatting and linting rules from the `.eslintrc` file.
If you also work on the backend, you could use [PhpStorm](https://www.jetbrains.com/phpstorm/) to develop the frontend, too. (PhpStorm is a superset of WebStorm.)

### Development toolset

#### Node.JS and NPM
The development environment is run by Node.JS, and the packages are managed by NPM.

#### React
React is an open-source JavaScript library for building user interfaces and UI components.  
https://reactjs.org/docs/getting-started.html

Core concepts:
- **Component**: React builds the user interface using components. Our components can be responsible for drawing the interface and can also contain complex logic. React allows us to define components using either classes or functions. The data of the components can be:
  - **State**: The internal data of the component.
  - **Property**: When we use a component, data can be passed to it. For example we can specify the text displayed on a button and the event handler that runs when clicked.
- **Hook**: enable functional components to have their own state. They make it easy to extract and share useful state logic between components. Both business and display logic can be shared with their help.
- **Context**: provides a way to pass data through the component tree without having to pass props down manually at every level.

#### TypeScript
TypeScript is an extension of the JavaScript language with a static type system. To use it, we need a TypeScript compiler that compiles our code into traditional JavaScript source files.

#### Create React App
Create React App is an officially supported command-line tool for creating React projects. We can choose from multiple templates and create JavaScript or TypeScript-based projects.  
https://create-react-app.dev/docs/getting-started/

#### React Query
The React Query library makes it simple to fetch, cache and synchronize server-side data. It is heavily built upon on the previously mentioned hooks.  
https://tanstack.com/query/v3/docs/react/overview

Core concepts:
 - **Query**: responsible for fetching the data. It can be used with the `useQuery` hook.
 - **Mutation**: is primarily responsible for executing requests with side effects. It can be used with the `useMutation`​​ hook.

#### React Hook Form
An open source library for creating forms in React applications.
It simplifies field validation and can be integrated with arbitrary component library.  
https://react-hook-form.com/get-started/

#### React-Bootstrap
The popular Bootstrap CSS library enables to develop responsive web applications quickly and efficiently.
*React-Bootstrap* makes it easier to use Bootstrap in React projects by providing a React component for each Bootstrap component. To create the two-panel layout in TMS, certain elements of the *Dashboard* official sample were used. Useful links:
 - https://react-bootstrap-v4.netlify.app/
 - https://getbootstrap.com/docs/4.6
 - https://getbootstrap.com/docs/4.6/examples/

The project currently uses React-Bootstrap version 1.6, which is built on Bootstrap 4.6.
Bootstrap 5 was released in the meantime, so pay attention which documentation you read!

#### CSS modules
If it is possible, custom components should be composed of React-Bootstrap components or standard HTML-elements styled with Bootstrap CSS classes. If custom CSS styles are needed, they should be placed in [CSS Modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/) to avoid name collisions.

#### React Router
React Router ensures that the current URL and the state of our application remain in sync.
The project is currently using version 5.1 of the library (https://v5.reactrouter.com/).

### Architecture

#### Presentational components

Contains presentational code, with simple event handlers to handle user input. They could contain `useState` hooks, but they are mainly for presentational purposes. They must not access the model layer directly.
In addition to our own components, the React-Bootstrap components also belong to this category.

This kind of components should placed in the global `src/components` or to the local `components` folder of the given page.

#### Container components
These components compose other components and the hooks/functions from the model layer in order to implement the functionality of a bigger part of the application, like pages, tabs and modals.
They can contain presentational and other container components. While HTML elements are also allowed in the current codebase, it is recommended to place them in presentational components.

This kind of components should placed in the global `src/conainters` or to the local `containers` folder of the given page.

#### Model layer
This layer contains the business logic. The model layer provides its functionality mainly with custom hooks, but traditional functions can be also used.

Contents:
- Client-side global state management, currently implemented with contexts.
- Server-side state management, implemented with React Query.
- Smaller utilities.

#### Service layer/API client
The API client is implemented using the `axios` library. It contains client functions for the backend API endpoints, and TypeScirpt interfaces for the corresponding the backend resources. If it is possible, the client functions and resource types should be organized similarly to the controller actions of the backend to make code navigation easier.

Only the model layer should access the service layer.

### Adding custom environment variables

[See Create React App documentation for more information](https://create-react-app.dev/docs/adding-custom-environment-variables/).
Also, you should provide type definitions to `src/react-app-env.d.ts`.
If the variable should be runtime configurable, then `src/runtime-env.ts` should also be updated accordingly.


DEVELOPMENT GUIDELINES
----------------------

### Workflow

The project follows the [Gitflow](http://nvie.com/posts/a-successful-git-branching-model/) feature branching model, therefore development for all issues should be carried out on a feature branch with following a naming convention that enables Gitlab to join the issues with the appropriate branches. This convention is `<issue id>-<custom name>`.  

The default development branch for the project is **develop**. Only project members with at least *Maintainer* role are allowed to push to this branch, *Developers* shall submit a merge request for code review in order to merge their feature branch back.  
The stable branch of the project is **master**. Only project members with at least *Maintainer* role are allowed to push or merge into this branch.

### Committing

The project uses the [Git Conventional Commits](https://www.conventionalcommits.org/) format for commit messages for uniform format and automated [Changelog](CHANGELOG.md) generation.
The rule is mandatory on the *master*, *develop* and *release* branches and optional, but encouraged on the *feature* branches.
Upon merging a feature branch into *develop*, the formatting must be enforced, meaning the commits will be squashed if they do not follow the convention.

Please note that each **fix** and **feat** commit will represent a new item in the changelog. Typically, a merge request shall only contain a single *fix* or *feat* commit, the version history of the branch should be rebased that way before merging (or be squashed upon merging).

### Automated linting

The project integrated [ESLint](https://eslint.org/) linter is useful to show and in many cases even fix styling problems to you early on. You may run it after you [installed](README.md#npm-install) the dependencies with NPM.
~~~bash
npm run lint  # check code style
npm run lint-fix # fix code style
~~~

### Testing

The TMS frontend comes both with E2E tests implemented with the [Cypress](https://www.cypress.io/) test frameworks You should always perform these tests as described in the [README](README.md#testing) before you submit your code for review.
Using the *Cypress UI* is advised, where you can run the tests interactively, step by step, and even debug them in the browser. This is invaluable for writing new tests or debugging failing ones.

For any new contribution, especially for adding new features, you *MUST* also provide the appropriate tests for them. Supplementing existing features with new tests where lacking is highly appreciated.

### Continuous integration

Upon pushing or merging to the server, the following tests are performed on the last commit:
* on all branches: code style check with ESLint; building the frontend web application, E2E tests with Cypress.
* *develop* branch: continuous deployment to staging environment.
* *master* branch: continuous deployment to production.


DOCUMENTATION GUIDELINES
------------------------

All *structural elements* (classes, methods, etc.) in the source code must be documented with the
[JSDoc](https://jsdoc.app/) format, so that an API documentation of the codebase can be generated from it.
