import {
    apiCommonMetadata
} from ".";
import { NavigationEntryDescription } from "./navigation";

import {
    RouteDescription
} from "./RouteDescriptions";


/**
 * 
 * @category Type
 * 
 */
export interface BackendVersion {

    /**
     * URL of the software used by the backend.
     */
    project_url: string

    /**
     * GIT SHA hash for the current version of the backend.
     */
    sha: string

    /**
     * Software version number of the backend.
     */
    version: string
}


/**
 * API root metadata is provided by the backend and must be accessible via it's
 * base URL ({@link UIEnvironment.API_URL}). This object is obtained via a `HTTP/OPTIONS` request and must be
 * returned as a `JSON` object that matches this interface.
 * 
 * This object is **only** to be fetched once on the UI loading and is
 * responsible for providing the necessary descriptions so the UI can be setup.
 * 
 * @category Backend
 * @since 0.1.0
 */
export interface apiRootMetadata extends apiCommonMetadata {

    // /**
    //  * Name of the site. This value will be displayed in the page header.
    //  */
    // name: String;

    // /**
    //  * Description on the site.
    //  */
    // description: String;

    /**
     * Navigation structure for the UI.
     * 
     * @expandType NavigationEntryDescription
     */
    navigation: Array<NavigationEntryDescription>;

    /**
     * Route layout description the UI will use to create the route layout.
     * 
     * @expandType RouteDescription
     * @since 0.13.0
     */
    routes: Array<RouteDescription>

    /**
     * Backend version information
     * 
     * @expandType BackendVersion
     */
    version: BackendVersion
}
