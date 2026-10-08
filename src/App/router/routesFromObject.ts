import {
    RouteObject
} from "react-router";

import {
    pageActions,
    pageComponents,
    pageLoaders
} from "."

import {
    RouteDescription
} from "../../types/backend/apiMetadata/RouteDescriptions";

import
    StateSplash,
    {
        StateIcon
} from "../../components/StateSplash"



/**
 * Dynamically build routes from a description. This description is done in
 * such a way that the UI does not require any changes when the description is
 * updated.
 * 
 * **Note:** Specifying handle `backend_url` will force the component to be set
 * to be set to {@link BackendLayout}
 * 
 * @summary Dynamically build the routes The UI will use.
 * 
 * @category Function
 * @since 0.13.0
 */
export function routesFromObject({
    routes,
    baseURL = window.env.API_URL
}: {
    /**
     * UI Route object from {@link apiRootMetadata.routes} to use to create
     * routes for the UI.
     */
    routes: RouteDescription[],

    /**
     * Base URL for the backend.
     */
    baseURL?: string
}): RouteObject[] {

    const routesObject = routes;

    let builtRoutes = [];

    for(let route of routesObject) {

        let builtRoute = {
            // id: undefined,
            // path: undefined,
            // Component: undefined,
            // HydrateFallback: undefined,
            middleware: []
            // loader: undefined,
            // action: undefined,
            // shouldRevalidate: undefined,
            // children: [],
        }

        let hasBackendURL: boolean = false

        if( Object.hasOwn( Object(route), 'handle' )) {

            if( Object.hasOwn( Object(route.handle), 'backend_url') ) {

                hasBackendURL = true;

            }
        }

        let hasRedirectURL: boolean = false

        if( Object.hasOwn( Object(route), 'handle' )) {

            if( Object.hasOwn( Object(route.handle), 'url_redirect') ) {

                hasRedirectURL = true;

            }
        }


        for( let [key, value] of Object.entries( route )) {

            switch( key ) {

                case "action":

                    if( ! Object.hasOwn(pageActions, String(value)) ) {

                        throw Error(`Invalid page action provided. '${String(value)}' does not exist`)

                    }


                    builtRoute['action'] = pageActions[String(value)]

                    break;

                case "children":

                    let backendURL = baseURL;

                    if( hasBackendURL ) {

                        backendURL = route.handle.backend_url;

                    }

                    builtRoute["children"] = routesFromObject({ routes: value, baseURL: backendURL })

                    break;

                case "component":

                    if( hasBackendURL && String(value) !== 'backend' ) {

                        throw Error('A component and a backendURL can not both be defined.');

                    }


                    if( ! hasBackendURL && String(value) === 'backend' ) {

                        throw Error('handle backendURL must be supplied when component=backend.');

                    }


                    if( ! hasRedirectURL && String(value) === 'redirect' ) {

                        throw Error('handle redirect_url must be supplied when component=backend.');

                    }


                    if( ! Object.hasOwn(pageComponents, String(value)) ) {

                        throw Error(`Invalid page component provided. '${String(value)}' does not exist`)
                    }


                    builtRoute["Component"] = pageComponents[String(value)];

                    break;

                case "handle":

                    
                    if( hasBackendURL ) {

                        builtRoute["Component"] = pageComponents['backend'];

                    }

                    builtRoute["handle"] = value;

                    break;

                case "hydrate":

                    if( value === 'loader' ) {

                        builtRoute["HydrateFallback"] = () => StateSplash({
                            titleText: "Loading Data",
                            icon: StateIcon.loading
                        });

                        break;
                    }

                    throw Error(`hydrate only accepts value 'loader'. Value '${String(value)}' does not exist`)


                case "id":

                    builtRoute["id"] = String(value);

                    break;

                case "index":

                    builtRoute["index"] = Boolean(value);

                    break;

                case "loader":

                    if( ! Object.hasOwn(pageLoaders, String(value)) ) {

                        throw Error(`Invalid page loader provided. '${String(value)}' does not exist`)
                    }


                    if( String(value) === 'github' ) {


                        // if( ! hasBackendURL ) {

                        //     throw Error('Github loader can not be used without \
                        //         specifying dir_root handle')

                        // }


                        builtRoute['loader'] = (params) => pageLoaders['github']({
                            ...params,
                            baseURL: baseURL,
                            // dirRoot: route.handle.dir_root,
                        })

                    } else { 

                        builtRoute['loader'] = (params) => pageLoaders[String(value)]({
                            ...params,
                            baseURL: baseURL,
                        })

                    }


                    break;

                case "path":

                    builtRoute["path"] = String(value);

                    break;

                case "revalidate":

                    if( Boolean(value) === true ) {

                        builtRoute["shouldRevalidate"] = () => true;

                    } else if( Boolean(value) === false ) {

                        builtRoute["shouldRevalidate"] = () => false;

                    }

                    break;

                // default:

                //     builtRoute[key] = value;

            }

        };

        builtRoutes.push( builtRoute )

    };

    return builtRoutes;
}
