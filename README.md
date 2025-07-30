# Task Management System - React Client

[![pipeline status](https://gitlab.com/tms-elte/frontend-react/badges/develop/pipeline.svg)](https://gitlab.com/tms-elte/frontend-react/-/commits/develop)

This project is the web client for <abbr title="Task Management System">TMS</abbr>, an assignment management and plagiarism detection software. The project is mainly written in [TypeScript](https://www.typescriptlang.org/) and based on the [React library](https://reactjs.org/).

## Requirements

Node.JS 22 or greater is required to build this application.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs the dependencies of the frontend.

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

### Build the application

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
The application is ready to be deployed.

See the section about [deployment](https://vite.dev/guide/static-deploy) for more information.

#### `npm run build:static` or `npm run build`

The artifacts produced by this command will contain environment variables that were set during the build.

#### `npm run build:dynamic`

In this mode some environment variables must be configured after the build.

### `npm run lint`

Runs ESLint.

### `npm run lint:fix`

Runs ESLint and tries to fix problems.

## Environment Variables

### .env files

These files store the default values for environment variables. \
**Important:** the following files are version controlled.

* `.env`: common settings
* `.env.development`: development mode specific settings (`npm start`)
* `.env.production`: production mode specific settings (`npm run build`)

If you want to override an environment variable, you should create a local .env file. \
`.env*.local` files are excluded from version control.

* `.env.development.local`: local overrides used in development mode (`npm run dev`)
* `.env.production.local`: local overrides used in production mode (`npm run build:static` amd `npm run build:dynamic`)

### Runtime configurable variables

Some environment variables are also runtime configurable, meaning you don't need to rebuild the frontend application to change their value.
This is especially convenient to reuse the same build in different environments.

To achieve this, simply build the frontend with `npm run build:dynamic`, and run the following commands **after** you have built the frontend.
```bash
# Set environment variables (Linux/MacOS syntax)
export VITE_VAR1=value1
export VITE_API_VAR2=value2

# Linux/MacOS
envsubst < dist/index.html > dist/temp.html
mv dist/temp.html dist/index.html

# Node.js alternative (platform independent)
npx envsub dist/index.html
```

E.g. to use the *blue* theme on Linux:
```bash
export VITE_THEME=blue

envsubst < dist/index.html > dist/temp.html
mv dist/temp.html dist/index.html
```

**IMPORTANT:** the values for variables that supports dynamic configuration will be omitted from the build,
even if they were set in the `.env` files.
This means, you have to substitute all of them before using the application- 

### Variables

| Name                              | Development mode | Static production mode | Dynamic production mode | Description                                                                                                                                                                                                  |
|:----------------------------------|:-----------------|:-----------------------|:------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `VITE_BASE_URL`                   | Used             | Used                   | Used (Build time)       | Frontend application baseurl. Only used in `vite.config.ts`, in the code the build in `BASE_URL` variable should be used instead.                                                                            |
| `VITE_DEV_PROXY`                  | Used             | Ignored                | Ignored                 | Backend server address that used in development mode. The development server will proxy API requests to this address.                                                                                        |
| `VITE_API_BASE_URL`               | Used             | Used                   | Used (Runtime)          | TMS API baseurl.                                                                                                                                                                                             |
| `VITE_LOGIN_METHOD`               | Used             | Used                   | Used (Runtime)          | Set login method. Possible values: `LDAP`, `MOCK`                                                                                                                                                            |
| `VITE_BACKEND_CORE_VERSION_RANGE` | Used             | Used                   | Used (Build time)       | This variable defines the accepted `backend-core` semantic version range. Check the documentation of the [semver](https://github.com/npm/node-semver) npm package for more information about version ranges. |
| `VITE_TIMEOUT_AFTER_FAILED_LOGIN` | Used             | Used                   | Used (Build time)       | Timeout duration in milliseconds after a failed login attempt.                                                                                                                                               |
| `VITE_THEME`                      | Used             | Used                   | Used (Runtime)          | UI theme.  Possible values: `dark`, `blue`.                                                                                                                                                                  |
| `VITE_GOOGLE_ANALYTICS_ID`        | Ignored          | Used                   | Used (Runtime)          | Google Analytics (GA4) tracking ID for website monitoring. If empty or undefined, tracking is disabled.                                                                                                      |


## Branding

You may create a `public/branding.json` configuration file based on the provided
sample in `src/branding.dist.json`, to define the branding information of your
TMS instance (e.g. organization name).

## Testing

This project utilizes [Cypress](https://www.cypress.io/) for robust *End-to-End (E2E)* testing. E2E tests simulate real user interactions with the application, ensuring that all components and features work together seamlessly from a user's perspective.

### Running E2E Tests
You have two primary ways to run the E2E tests:

1. **Run Tests in Headless Mode (CLI):** execute all Cypress tests in a headless browser environment:  
   ```bash
   npm run cypress
   ```
   After execution, Cypress will provide a summary in the terminal, indicating which tests passed or failed.

2. **Open Cypress Test Runner (Interactive UI):** launch the *Cypress Test Runner* application, providing an interactive interface to select, run, and debug the tests:  
   ```bash
   npm run cypress:ui
   ```
    This command opens the Cypress Test Runner, allowing you to visually inspect the tests as they run in a browser.

## Dependencies

* [TypeScript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [React Router](https://reactrouter.com/)
* [Axios](https://github.com/axios/axios)
* [FileSaver](https://github.com/eligrey/FileSaver.js#readme)
* [React Query](https://react-query.tanstack.com/)
* [React Hook From](https://react-hook-form.com/)
* [React Bootstrap](https://react-bootstrap.github.io/): v1.5.2 based on
  [Bootstrap 4.6](https://getbootstrap.com/docs/4.6/getting-started/introduction/)
* [React i18next](https://react.i18next.com/)
* [React MDE (Markdown Editor)](https://github.com/andrerpena/react-mde)
* [React Markdown](https://github.com/remarkjs/react-markdown)
* [react-dual-listbox](https://www.npmjs.com/package/react-dual-listbox)
* [Victory](https://formidable.com/open-source/victory/)
* [Luxon](https://moment.github.io/luxon/)
* [semver](https://github.com/npm/node-semver)
* [vite](https://vite.dev/)
* [Cypress](https://www.cypress.io/)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on issue policies, and the process for contributing to the development.

## License

This project is licensed under the BSD License - see the [LICENSE.md](LICENSE.md) file for details.
