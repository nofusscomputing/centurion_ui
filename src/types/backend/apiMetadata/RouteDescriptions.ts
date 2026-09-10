import {
    RouteObject
} from "react-router"

import {
    apiRootMetadata
} from "./root"


/**
 * Available keys for use to select route action.
 * 
 * @category Description
 * @since 0.13.0
 */
export type RouteActionDescription =
    
    /**
     * Use API FormSubmission.
     */
    "api"



/**
 * Available keys for use within a routes handle.
 * 
 * @category Description
 * @since 0.13.0
 */
export interface RouteHandleDescription {

    /**
     * URL base for the backend.
     */
    backend_url?: string

    /**
     * Cached {@link apiRootMetadata} from the backend at
     * {@link RouteHandleDescription.backend_url}. This key **must not be
     * populated** by the end-user when declaring routes. The key is
     * automatically populated by {@link dynamicRouter}
     */
    metadata?: apiRootMetadata | undefined

    /**
     * This key is only used by {@link Redirect} layout.
     * 
     * URL to perform a HTTP/POST against.
     */
    url_post?: string

    /**
     * This key is only used by {@link Redirect} layout.
     * 
     * URL to redirect to.
     */
    url_redirect?: string

}



/**
 * 
 * @category Description
 * @since 0.13.0
 */
export type RouteHydrateComponentDescription =

    /**
     * Loading Spinner.
     */
    "loader"



/**
 * Available route loaders.
 * 
 * @see {@link pageLoaders}
 * 
 * @category Description
 * @since 0.13.0
 */
export type RoutePageLoaderDescription =

    /**
     * Use {@link djangoLoader}. 
     */
    "django"
    |
    /**
     * Use {@link djangoMetadataLoader}.
     */
    "django_metadata"
    |
    /**
     * Use {@link djangoRootMetadataLoader}.
     */
    "django_root_metadata"
    |
    /**
     * Use {@link githubLoader}.
     */
    "github"



/**
 * Available layout components for use with a dynamic route.
 * 
 * @see {@link pageComponents}
 * @category Description
 * @since 0.13.0
 */
export type RouteComponentDescription =
    
    /**
     * This backend, regardless of what value you set here will be used
     * automatically if {@link RouteHandleDescription.backend_url} is supplied
     * a value. This is done to ensure that context is correctly set.
     * 
     * Use {@link BackendLayout}
     */
    "backend"
    |
    // /**
    //  * Base Layout.
    //  */
    // "baseview"
    // |
    /**
     * This layout should have its route {@link NonIndexRouteDescription.path | path} set to `:pk`. Value `:pk` is a
     * placeholder that is dynamic. PK for the unfamiliar stands for
     * _"Primary Key"_ which is a unique ID used by databases. Its recommended
     * usage here is two-fold: denotes a single item and if you need to use
     * path `/add` (used for new object creation, see {@link DetailLayout}) you
     * can.
     * 
     * Use {@link DetailLayout}.
     */
    "detail"
    |
    /**
     * Use {@link History}.
     */
    "history"
    |
    /**
     * Use {@link Redirect}.
     */
    "redirect"
    |
    /**
     * Use {@link List}.
     */
    "list"
    |
    /**
     * Use {@link Markdown}.
     */
    "markdown"
    |
    /**
     * Use {@link Settings}
     */
    "settings"
    |
    /**
     * Use {@link Ticket}.
     */
    "ticket"



/**
 * 
 * @category Type
 * @since 0.13.0
 */
export interface RouteCommonDescription {

    /**
     * id to use for this route.
     * 
     */
    id?: string,

    /**
     * Component to use for this route.
     * 
     * @expandType RouteComponentDescription
     */
    component?: RouteComponentDescription,

    /**
     * Arbitrary data for this route.
     * 
     * @expandType RouteHandleDescription
     */
    handle?: RouteHandleDescription

    /**
     * Component to use for hydration.
     * 
     * @expandType RouteHydrateComponentDescription
     */
    hydrate?: RouteHydrateComponentDescription,

    /**
     * Loader to use for this route. Only specify a loader if there is data
     * that must be fetched.
     * 
     * @expandType RoutePageLoaderDescription
     */
    loader?: RoutePageLoaderDescription,

    /**
     * 
     * @expandType RouteActionDescription
     */
    action?: RouteActionDescription,

    /**
     * Should the loader data be re-validated on a navigation event.
     */
    revalidate?: boolean,

}



/**
 * This Description describes index routes that are used by
 * {@link routesFromObject} to build the {@link RouteObject}s for the UI.
 * 
 * @category Description
 * @since 0.13.0
 */
export interface IndexRouteDescription extends RouteCommonDescription {

    /**
     * Is this route an index route? This value must always be set to `true`
     */
    index: boolean

}



/**
 * This Description describes non-index routes that are used by
 * {@link routesFromObject} to build the {@link RouteObject}s for the UI.
 * 
 * @see {@link routesFromObject}
 * @category Description
 * @since 0.13.0
 */
export interface NonIndexRouteDescription extends RouteCommonDescription {

    /**
     * The value that you use here is dependent upon how you are building your
     * routes. If you are nesting routes, then the value here will be a single
     * part of the url.
     * 
     * _i.e. `full-url=/some/path/here` for the parent route,
     * this value would be set to `some`._
     * 
     * This value can also be setup to be dynamic. To do this prefix the name
     * of the dynamic path you wish to use for this route with a colin ":".
     * 
     * _i.e. `full-url=/some/path/here` if you wanted the parent route to be
     * dynamic with a name of "section", this value would be set to
     * `:section`._
     * 
     * @summary URL path for this route.
     */
    path?: string

    /**
     * Child routes for this route.
     */
    children?: Array<RouteDescription>

}



/**
 * This object describes the routes so that the UI can setup the routes
 * dynamically. Routes are provided by a backend.
 * 
 * The initial fetching of this object is done via a {@link apiRootMetadata}
 * request to the {@link UIEnvironment.API_URL}. Any subsequent requests for
 * further routes, will use the url provided 
 * as part of the route via {@link RouteHandleDescription.backend_url}. See
 * below for examples.
 * 
 * @example Root Routes
 * 
 * A basic `json` description for a simple routing structure.
 * 
 * ``` json
 * 
 * [
 *     {
 *         "id": "root",
 *         "path": "/",
 *         "revalidate": false,
 *         "hydrate": "loader",
 *         "children": [
 *             {
 *                 "path": ":module",
 *                 "children": [
 *                     {
 *                         "path": ":model",
 *                         "action": "api",
 *                         "children": [
 *                             {
 *                                 "index": true,
 *                                 "component": "list",
 *                                 "loader": "django"
 *                             },
 *                             {
 *                                 "path": ":pk",
 *                                 "component": "detail",
 *                                 "action": "api",
 *                                 "loader": "django"
 *                             }
 *                         ]
 *                     }
 *                 ]
 *             }
 *         ]
 *     }
 * ]
 * 
 * ```
 * 
 * This example covers the following:
 * 
 * - id root is the base path to the site. `/`
 * 
 * - All paths are dynamic.
 * 
 * - Navigation structure of:
 * 
 *      - `/:module/:model`
 * 
 *      - `/:module/:model/:pk`
 * 
 * A colin ':' prefixed to a path denotes that the route is dynamic. What
 * ever value is actually used there will be passed directly to the backend.
 * For example, if you navigated to `/accounting/assets`, which is an index
 * route with `list` as its component. This means that the path would show
 * the {@link apiDataset | dataset} on this path.
 * 
 * Like wise navigating to `/accounting/assets/45` which is the route with
 * `detail` as its component. This means that the path would show an
 * {@link apiObject | object}. In this case an asset with an id/pk of `45`
 * would be what is viewed.
 * 
 * When describing your routes, only specify what is required. Using the
 * example above, you will only see a `loader` specified twice. This is because
 * where it has been specified is where data must be obtained from the
 * specified backend. In this case Django.
 * 
 * @example Additional Routes
 * 
 * It is possible to specify an additional backend and routes. However for this
 * they must be specified as child of [Root Routes](#example-root-routes).
 * 
 * ``` json
 * 
 * [
 *     {
 *         "id": "root",
 *         "path": "/",
 *         "revalidate": false,
 *         "hydrate": "loader",
 *         "children": [
 *             {
 *                 "id": "centurion_erp",
 *                 "path": "centurion_erp",
 *                 "handle": {
 *                     "backend_url": "https://my-backend.tld/api/v2"
 *                 }
 *             }
 *         ]
 *     }
 * ]
 * 
 * ```
 * 
 * In this example, path `/centurion_erp` has no children. However what will
 * occur since `handle.backend_url` has been specified, a
 * {@link apiRootMetadata} request will be made to fetch the routes that will
 * be added as children.
 * 
 * @category Type
 * @expandType NonIndexRouteDescription
 * @expandType IndexRouteDescription
 * @since 0.13.0
 */
export type RouteDescription = NonIndexRouteDescription | IndexRouteDescription