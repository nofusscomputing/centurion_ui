---
title: Setup
description: How to setup Centurion User Interface for use with your backend.
date: 2026-03-15
template: project.html
about: https://github.com/nofusscomputing/centurion_ui/
---

Centurion UI only requires that you setup the root URL for your site. Depending on how you have deployed Centurion UI, will depend upon how you need to configure it.


## Deploying Centurion UI

There are two ways to deploy Centurion UI, they are:

- Official Docker Container.

- Hosting the Build artifacts on your own web server.


### Official Docker Container

On each release of Centurion UI, we build a docker container. This container has a webserver already configured, with the only configuration requirement being that when you launch the container, you set environmental variable `API_URL` to the value of you backend's root URL. As soon as the container is running, the UI is ready for use.


### Self Hosting build artifacts

If you decide you dont want to use the docker container you can copy the build artifacts from the container to your own webserver. Doing so however requires a few extra steps in configuration, they are:

- To configure the backend root url, edit file [`assets/js/env.js`](./api/UIEnvironment/index.md) and update variable `API_URL` to the value of you backend's root URL.

- To ensure that the correct items are cached, review the nginx webserver config in the repository at path `includes/etc/nginx/conf.d/default.conf`. This will show you what paths and the patterns for determining what files to cache.

!!! tip
    If you fail to setup caching on the correct files when self hosting Centurion UI, Bandwidth usage will climb exponentially. This is because, evertime someone navigates to the site, it will download **all** of the build artifacts again. This is thousands of times large than would normally be downloaded per page view.
