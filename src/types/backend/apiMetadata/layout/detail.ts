


/**
 * This layout is for displaying a single object from a dataset.
 * 
 * @category Description
 * @see [Detail Layout - Demo Site](https://centurion-ui.nofusscomputing.com/layout/detail/1)
 * @since 0.10.0
 */
export interface layoutDetail {

    /**
     * Detail Layout
     * 
     * Used by any instance of {@link DetailLayout}.
     */
    detail: {

        /**
         * Layout type that is to be used to render the data.
         */
        name: "detail";

        layout: "single" | "double"

        left: object

        right: object

    }

}
