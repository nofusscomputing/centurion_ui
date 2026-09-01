import {
    createBrowserRouter,
    RouteObject,
} from "react-router"

import {
    pageComponents,
    pageLoaders
} from "."

import {
    routesFromObject
} from "./routesFromObject"

import
    StateSplash,
    {
        StateIcon
} from "../../components/StateSplash"

import useDjangoFetcher from "../../hooks/useDjangoFetcher"

import NotificationLayout from "../../layouts/Notifications"
import PageContent from "../../layouts/PageContent"
import RouteErrorBoundary from "../../layouts/ErrorBoundary"
import UI from "../../layouts/ui"

import {
    RouteDescription
} from "../../types/backend/apiMetadata/RouteDescriptions"



/**
 * A dynamic router that sets up the initial layout, ready to make an 
 * {@link apiRootMetadata} request to the {@link UIEnvironment.API_URL} to load
 * the initial routes from the backend when the user navigates.
 * 
 * On any occasion a user navigates to a path not within the current route
 * tree, the dynamic loader will run. If the path to navigate to, has a parent
 * that is a {@link BackendLayout} then a request for its
 * {@link apiRootMetadata} will be made. If the parent is not a
 * {@link BackendLayout}, then a `HTTP/404` will be returned as would be
 * expected.
 * 
 * When any request is made, to a {@link apiRootMetadata}, that data will be
 * cached in {@link RouteHandleDescription.metadata} so that the
 * {@link BackendProvider} can make it available to child routes.
 * 
 * @summary Dynamic Router
 * 
 * @category Function
 * @see {@link RouteDescription} for route descriptions.
 * @see {@link RouteComponentDescription} `backend` for backend_url auto setting of component.
 * @since 0.13.0
 */
const dynamicRouter = () => {

    const routes: RouteObject[] = [
            {
                id: "base",
                Component: pageComponents['baseview'],
                ErrorBoundary: RouteErrorBoundary,
                HydrateFallback: () => StateSplash({titleText: "Loading UI", icon: StateIcon.loading }),
                children: [
                    /**
                     * Note: For a site that requires auth, login redirect cant
                     * be part of the dynamic routes. This is because the error
                     * boundary that uses a redirect will not have access to
                     * the dynamic routes until after they are loaded.
                     */
                    {
                        id: "login",
                        path: "/login",
                        Component: pageComponents['redirect'],
                        handle: {
                            url_redirect: `${window.env.API_URL}/auth/login`
                        }
                    },
                    {
                        id: "logout",
                        path: "/logout",
                        Component: pageComponents['redirect'],
                        handle: {
                            url_post: `${window.env.API_URL}/auth/logout`,
                            url_redirect: `${window.env.API_URL}/auth/login`
                        }
                    },
                    {
                        id: "root-backend",
                        Component: pageComponents['backend'],
                        handle: {
                            backend_url: window.env.API_URL
                        },
                        children: [
                            {
                                id: "notifications",
                                Component: NotificationLayout,
                                children: [
                                    {
                                        id: "UI",
                                        Component: UI,
                                        ErrorBoundary: RouteErrorBoundary,
                                        HydrateFallback: () => StateSplash({titleText: "Loading UI", icon: StateIcon.loading }),
                                        children: [
                                            {
                                                id: "page",
                                                Component: PageContent,
                                                HydrateFallback: () => StateSplash({titleText: "Loading Page Content", icon: StateIcon.loading }),
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                ]
            }
        ];


    /**
     * When using `patchRoutesOnNavigation` ensure that basename os set tp `""`
     * so that the patching of routes always runs if the route is not found.
     */
    return createBrowserRouter(
        routes,
        {
            basename: "",
            async patchRoutesOnNavigation({ patch, path, signal, matches }) {

                let baseURL = null;
                let id = null;
                let route = null;
                let url = null;

                if( matches.length === 0 ) {    // root routes

                    id = 'page'
                    url = '/'
                
                } else if( matches.length > 0 ) {    // Sub-routes

                    route = matches[(matches.length - 1 )].route;

                    if( Object.hasOwn(route, 'handle') ) {

                        if( Object.hasOwn(route.handle, 'backend_url')) {

                            baseURL = route.handle.backend_url;

                            id = route.id

                            /**
                             * URL commented out so as to disable this feature 
                             * until it is ready for use. When uncommented the
                             * routes will be downloaded from the backend_url.
                             */
                            // url = route.handle.backend_url

                        }
                    }
                }


                if( id !== null && url !== null ) {

                    const { apiMetadata, apiData } = await useDjangoFetcher({
                        url: url,
                        baseURL: window.env.API_URL,
                        onlyMetadata: true,
                        signal: signal
                    });

                    const data = await apiMetadata.clone().json();

                    let routeToUpdate: RouteDescription;

                    if( matches.length === 0 ) {

                         routeToUpdate = this.routes[0].children[(this.routes[0].children.length - 1)]

                    } else {

                        routeToUpdate = matches[(matches.length - 1)].route

                    }

                    // cache the rootMetadata from this backend.
                    routeToUpdate.handle.metadata = data;

                    patch(id, routesFromObject({
                        routes: data.routes,
                        ...(baseURL ? {baseURL: baseURL } : {})
                    }));

                }
            },
        }
    )
}

export default dynamicRouter;
