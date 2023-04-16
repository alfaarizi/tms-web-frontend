# Task Manager System - React Client

[![pipeline status](https://gitlab.com/tms-elte/frontend-react/badges/develop/pipeline.svg)](https://gitlab.com/tms-elte/frontend-react/-/commits/develop)

This project is the web client for <abbr title="Task Management System">TMS</abbr>, an assignment management and plagiarism detection software. The project is mainly written in [TypeScript](https://www.typescriptlang.org/) and based on the [React library](https://reactjs.org/).

## Requirements

Node.JS 18 or greater is required to build this application.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs the dependencies of the frontend.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
The application is ready to be deployed.

See the section about [deployment](https://create-react-app.dev/docs/deployment/) for more information.

### `npm run lint`

Runs ESLint.

### `npm run lint-fix`

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

* `.env.development.local`: local overrides used in development mode (`npm start`)
* `.env.production.local`: local overrides used in production mode (`npm run build`)

### Variables

| Name                                   | Development mode | Production mode | Description                                                                                                                                                                                                  |
|:---------------------------------------|:-----------------|:----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `PUBLIC_URL`                           | Used             | Used            | Frontend application baseurl. If you use this variable, you shouldn't set `homepage` in `package.json`.                                                                                                      |
| `REACT_APP_API_BASEURL`                | Used             | Used            | TMS API baseurl.                                                                                                                                                                                             |
| `REACT_APP_LOGIN_METHOD`               | Used             | Used            | Set login method. Possible values: `LDAP`, `MOCK`                                                                                                                                                            |
| `REACT_DEV_PROXY`                      | Used             | Ignored         | Backend server address that used in development mode. The development server will proxy API requests to this address.                                                                                        |
| `REACT_APP_BACKEND_CORE_VERSION_RANGE` | Used             | Used            | This variable defines the accepted `backend-core` semantic version range. Check the documentation of the [semver](https://github.com/npm/node-semver) npm package for more information about version ranges. |
| `REACT_APP_TIMEOUT_AFTER_FAILED_LOGIN` | Used             | Used            | Timeout duration in milliseconds after a failed login attempt.                                                                                                                                               |
| `REACT_APP_THEME`                      | Used             | Used            | UI theme.  Possible values: `dark`, `blue`.                                                                                                                                                                  |

[Create React App specific environment variables](https://create-react-app.dev/docs/advanced-configuration/)

### Adding custom environment variables

[See Create React App documentation for more information](https://create-react-app.dev/docs/adding-custom-environment-variables/).
Also, you should provide type definitions to `src/react-app-env.d.ts`.

## Branding

You may create a `public/branding.json` configuration file based on the provided
sample in `src/branding.dist.json`, to define the branding information of your
TMS instance (e.g. organization name).

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

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on issue policies, and the process for contributing to the development.

## License

This project is licensed under the BSD License - see the [LICENSE.md](LICENSE.md) file for details.
