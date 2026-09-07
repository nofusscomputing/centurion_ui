


/**
 * Dataset Layout
 * 
 * Used by any instance of {@link DataSetList}.
 * 
 * Using a string value for the column, must be a valid field name.
 * 
 * Using an object as the value enables any field to be setup so that it is
 * a link to any of the urls within {@link apiObject}
 * 
 * @example
 * ``` json
 * {
 *     "field": "<name of the field to render as link>",
 *     "type": "link",
 *     "key": "<name of the url key under _object._urls to use as the link>"
 * }
 * ```
 *
 * Normally the key for the url to use would be `_self` as this provides
 * for using any of the objects fields to link to its own data view page.
 * 
 * @category Description
 * @see [List Layout - Demo Site](https://centurion-ui.nofusscomputing.com/layout/table)
 * @since 0.10.0
 */
export interface layoutDataset {

    dataset: {

        columns: [[string | object]]

    }

}
