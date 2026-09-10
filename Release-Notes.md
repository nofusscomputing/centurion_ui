## v0.14.0

- Routing has been migrated to be fully dynamic. This means if the backend does not supply the routes as part of the [root](https://nofusscomputing.com/projects/centurion_user_interface/api/apiRootMetadata/) request, the UI **will not work** The backend must now be setup to describe the routes for the UI. see [Route Description](https://nofusscomputing.com/projects/centurion_user_interface/api/RouteDescription/) for further information.


## v0.13.0

- Begin refactor of fetching api data. This move is towards creating data/backend specific fetchers and preparation for dynamic routes.

    - HTTP base fetcher added.

    - JSON HTTP fetcher added.

    - Django fetcher added.

    - Markdown HTTP fetcher added.

    - Github fetcher added.

- package name update to reflect that it's a separate project, `centurion-erp-ui` -> `centurion-ui`. This change also has occured on the repositories name as well as the docker containers name.
