
/**
 * Describes the structure of the navigation menu.
 * 
 * @category Description
 * @since 0.1.0
 */
export interface NavigationEntryDescription {

    /**
     * Human readable name to use as the navigation entry.
     */
    display_name: string

    /**
     * Icon name to display.
     */
    icon?: string

    /**
     * Relative url to the page this navigation entry gos to.
     */
    link: string

    /**
     * Unique identifier for this navigation entry.
     */
    name: string

    /**
     * Children navigation entries. These will be added underneath this entry.
     */
    pages?: Array<NavigationEntryDescription>

}