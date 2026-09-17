ARG CI_PROJECT_URL=''
ARG CI_COMMIT_SHA=''
ARG CI_COMMIT_TAG=''

ARG ALPINE_VERSION=3.24
ARG NGINX_VERSION=1.31.3
ARG NODE_VERSION=24


FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as build


COPY . /workdir


WORKDIR /workdir


RUN npm ci --foreground-scripts

RUN npm run build




FROM nginx:${NGINX_VERSION}-alpine${ALPINE_VERSION}-slim AS prepare


COPY --from=build /workdir/build/ /usr/share/nginx/html/


COPY includes/ /

RUN apk update --no-cache; \
    apk upgrade --no-cache; \
    apk add --no-cache \
        supervisor; \
    rm -f /etc/supervisord.conf; \
    chmod +x /entrypoint.sh


# Clean-up
RUN \
    rm -f \
        $(which apk) \
        $(which wget);



FROM scratch


LABEL \
  org.opencontainers.image.vendor="No Fuss Computing" \
  org.opencontainers.image.title="Centurion ERP UI" \
  org.opencontainers.image.description="An automagic react UI." \
  io.artifacthub.package.license="AGPL-3.0-ONLY"


ARG CI_PROJECT_URL
ARG CI_COMMIT_SHA
ARG CI_COMMIT_TAG


ENV CI_PROJECT_URL=${CI_PROJECT_URL}
ENV CI_COMMIT_SHA=${CI_COMMIT_SHA}
ENV CI_COMMIT_TAG=${CI_COMMIT_TAG}

ENV API_URL="http://127.0.0.1:3000/mock/api/v2"


COPY --from=prepare / /


WORKDIR /var/log


EXPOSE 80


VOLUME [ "/var/log" ]


HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD \
  supervisorctl status || exit 1


ENTRYPOINT [ "/entrypoint.sh" ]
