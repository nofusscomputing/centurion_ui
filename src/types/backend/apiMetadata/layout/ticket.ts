


/**
 * Ticket Layout
 * 
 * @category Description
 * @see [Ticket Layout - Demo Site](https://centurion-ui.nofusscomputing.com/layout/ticket/request/7)
 * @since 0.10.0
 */
export interface layoutTicket {

    /**
     * This layout is for displaying data that is considered a work item, a ticket.
     */
    ticket: {

        /**
         * The `string` value for this field must be derived from {@link apiObject._urls}. Ensure
         * that the model for this layout has {@link UILayout.dataset} defined as part of its layout.
         * 
         * This URL will then be used to perform a query to the backend using the url. The results
         * returned will then be displayed in {@link DataSetList} format via the {@link CardDataSet}
         * card.
         * 
         * @summary Blocks of sub info..... ToDo: fix name. i.e. Ticket Dependencies, related Models.
         */
        blocks?: string

        /**
         * Fields to display in the sidebar
         * 
         * Each value placed here must be an existing key as defined {@link APIMetadata.fields} of the
         * current {@link APIMetadata} object being used.
         * 
         */
        sidebar: [string]

    }


}
