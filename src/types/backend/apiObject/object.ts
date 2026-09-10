import {
    APIDataObjectUrls
} from ".";



/**
 * This object is a single row of a dataset.
 * 
 * @summary A Single object.
 * 
 * @category Backend
 * @since 0.1.0
 */
export interface apiObject {
    /**
     * Unique ID from the database. Generally this will be the Primary Key.
     */
    id: number;

    /**
     * Field data
     */
    [key: string]: any;

    /**
     * URLs for this objects relationships.
     * 
     * @expandType APIDataObjectUrls
     */
    _urls: APIDataObjectUrls;

}