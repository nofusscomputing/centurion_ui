
/**
 * 
 * This set of URLs are used for navigating the paginated results.
 * 
 * @category Backend / Data Type
 * @since 0.1.0
 */
export interface DatasetLinks {

    /**
     * URL to the first page of the complete dataset
     */
    first: URL;

    /**
     * URL of the last page of the complete dataset. Must default to the same
     * value as first if there is only one page of results.
     */
    last: URL;

    /**
     * URL to the next page of results in the complete dataset. Must default to
     * null if there is only one  page of results or there is no next page.
     */
    next: null | URL;

    /**
     * URL to the previous page of results in the complete dataset. Must
     * default to null if the  current page is the first page.
     */
    prev: null | URL;
}


/**
 * @category Backend / Data Type
 * @since 0.1.0
 */
export interface DatasetMeta {

    /**
     * Pagination details.
     * 
     * @expandType DatasetMetaPagination
     */
    pagination: DatasetMetaPagination;
}



/**
 * 
 * Provides the details required for pagination.
 * 
 * @category Backend / Data Type
 * @since 0.1.0
 */
export interface DatasetMetaPagination {

    /**
     * Total number of objects in the complete dataset.
     */
    count: number;

    /**
     * Current page number.
     */
    page: number;

    /**
     * Total number of pages for the complete dataset.
     */
    pages: number;
}
