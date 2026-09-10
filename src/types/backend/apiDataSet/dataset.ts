import {
    DatasetLinks,
    DatasetMeta
} from ".";

import {
    apiObject
 } from "../apiObject/object";



/**
 * 
 * This Object contains many single objects.
 * 
 * @summary A Set of Objects.
 * 
 * @category Backend
 * @since 0.1.0
 * 
 */
export interface apiDataset {

    /**
     * DataObjects part of this dataset.
     * 
     * @expandType apiObject
     */
    results: apiObject[];

    /**
     * URLs used for paginated results.
     * 
     * @expandType DatasetLinks
     */
    links: DatasetLinks;

    /**
     * Definitions for dataset.
     * 
     * @expandType DatasetMeta
     */
    meta: DatasetMeta;
}
