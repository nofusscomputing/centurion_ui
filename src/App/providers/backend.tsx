import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    useMatches
} from "react-router";

import {
    apiRootMetadata
} from "../../types/backend/apiMetadata/root";
import {
    RouteDescription,
} from "../../types/backend/apiMetadata/RouteDescriptions";



/**
 * Stores the URL of the backend for the current context. This location is the
 * only location that is to be used to obtain the backend details. The intent
 * is that everything that requires backend information will obtain it from
 * this context. Access is via {@link useBackendProvider}
 * 
 * @summary Backend Context
 * 
 * @category Type
 * @since 0.13.0
 */
export type BackendContext = {

    /**
     * Root metadata from the backend.
     */
    rootMetadata: apiRootMetadata

    /**
     * Url to the backend
     */
    url: string
}


/**
 * @internal
 */
export const backendContext = createContext<BackendContext>({
    rootMetadata: null,
    url: null
});



/**
 * @summary Props for the {@link BackendProvider}
 * 
 * @category Props
 * @since 0.13.0
 */
export interface BackendProviderProps {

    /**
     * The nodes to wrap in this provider.
     */
    children: React.ReactNode
}



/**
 * This provider stores the {@link BackendContext | data} about the current
 * backend. This provider is intended to be used so that every object under the
 * route layout will use the details within this provider. For example:
 * 
 * - Around a RouterProvider
 * 
 * - Around a route layout.
 * 
 * To use this provider directly {@link useBackendProvider} is available.
 * 
 * You should not ever need to declare this provider directly. This is
 * because when declaring your routes, as soon as a `backend_url` has been
 * supplied, this provider is automatically added via {@link BackendLayout}.
 * 
 * @example
 * 
 * ``` js
 * 
 * ...
 * 
 * return (
 *     <BackendProvider
 *         value = {
 *             metadata: apiRootMetadata,
 *             url = "https://my-backend-provider-url.tld/api/v2"
 *         }
 *     >
 *         <RouterProvider router={router} />
 *     </BackendProvider>
 * );
 * 
 * ...
 * 
 * ```
 * 
 * @summary Backend context provider.
 * 
 * @category Provider
 * @expandType BackendProviderProps
 * @since 0.13.0
 */
export function BackendProvider({
    children
}: BackendProviderProps) {

    const routes: Array<RouteDescription> = useMatches();

    const [ url, setURL ] = useState(null);

    const [ rootMetadata, setRootMetadata ] = useState(null);

    useEffect(() => {

        if( routes.length > 0 && url === null ) {

            for( let i = (routes.length - 1); i >= 0;  i-- ) {

                if( ! Object(routes[i]).hasOwnProperty('handle') ) continue;

                if( ! Object(routes[i].handle).hasOwnProperty('backend_url') ) continue;

                setURL(routes[i].handle.backend_url);

                if( ! Object(routes[i].handle).hasOwnProperty('metadata') ) continue;

                setRootMetadata(routes[i].handle.metadata);

                break;
            }
        }
    }, []);


    return (
        <backendContext.Provider
            value = {{
                rootMetadata: rootMetadata,
                url: url
            }}
            >
            {children}
        </backendContext.Provider>
    );
}



/**
 * This hook obtains the values of the {@link BackendProvider}.
 * 
 * @summary Hook to use BackendProvider
 * 
 * @category Hook
 * @since 0.13.0
 */
export function useBackendProvider(): BackendContext {

    return useContext(backendContext);

}
