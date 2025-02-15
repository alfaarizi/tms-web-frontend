Docker Guide
==================

This guide describes how to build and use the Docker image for the *TMS Web Frontend* project. This image is intended for production usage.
In case you are interested in setting up a containerized development environment for TMS, please refer to the [TMS Compose](https://gitlab.com/tms-elte/compose) guide instead.

In general, for production, we advise to use the prebuilt images hosted at *DockerHub* (`tmselte/frontend-react`). Only in special circumstances should you build your own production images.

**Available images:**
- **Latest stable build:** the `lastest` tag is the newest stable, released version of the *TMS Web Frontend*. Preferred to be used in a production environment.
- **Versioned stable builds:** the versioned tags (e.g. `3.4.0`) contain the respective release of the *TMS Web Frontend*.
- **Nightly build:** the `nightly` tag is the newest development version of the *TMS Web Frontend*. Contains the new features before their release, but has a higher chance to contain bugs.

BUILD IMAGE
------------------

Build the image of the project and name it.

```bash
docker build -t tms-frontend .
```

RUN CONTAINER
------------------

You can run the `tms-frontend` image created above. As a bare minimum, you must specify and mount a configuration file to use.
In this example the frontend will be available over port `3000` on the host machine.

```bash
docker run \
  --name tms-frontend-container \
  --publish 3000:80  \
  tms-frontend
```

Make sure the image name `tms-frontend` is correctly included in both the `docker build` and `docker run` commands to ensure clarity and prevent errors.


### Environment variables

The runtime configurable environment variables mentioned in the [README](README.md#variables) are configurable without rebuilding the docker image.

| Name                                    | Description                                                                                               |
|:----------------------------------------|:----------------------------------------------------------------------------------------------------------|
| `VITE_API_BASE_URL`                 | TMS API baseurl.                                                                                          |
| `VITE_LOGIN_METHOD`                | Set login method. Possible values: `LDAP`, `MOCK`                                                         |
| `VITE_THEME`                       | UI theme.  Possible values: `dark`, `blue`.                                                               |
| `VITE_GOOGLE_ANALYTICS_ID`         | Google Analytics (GA4) tracking ID for website monitoring. If empty or undefined, tracking is disabled.   |


### Execute commands in the container

E.g. to change Runtime configurable variables:
```bash
docker exec tms-frontend-container npx react-inject-env set
```

MULTI-CONTAINER ENVIRONMENT
------------------

If you are interested in setting up a multi-container environment to host TMS, please refer to the [TMS Compose](https://gitlab.com/tms-elte/compose) guide instead.