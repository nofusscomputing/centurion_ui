import {
    apiCommonMetadata
} from ".";

import { fieldType } from "./fields";

import { UILayout } from "./layout";

/**
 * API metadata is provided by the backend and must be accessible via the URL
 * used to access the backend in question. This object is obtained via a
 * `HTTP/OPTIONS` request and must be returned as a JSON object that matches
 * this interface.
 * 
 * @category Backend
 * @since 0.1.0
 */
export interface apiMetadata extends apiCommonMetadata {

    /**
     * Value to use as the page title.
     * 
     * @since 0.5.0
     */
    name: string

    /**
     * Value to use as the page description
     * 
     * @since 0.5.0
     */
    description: string

    /**
     * Link to the documentation pertaining to this endpoint.
     * @since 0.5.0
     */
    documentation: String;

    /**
     * Description of the backend fields
     * 
     * @expandType fieldType
     */
    fields: Array<fieldType>

    /**
     * @expandType UILayout
     */
    layout: UILayout

}
