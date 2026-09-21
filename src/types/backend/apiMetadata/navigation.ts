
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

}



/**
 * Describes the structure of the navigation menu.
 * 
 * @category Description
 * @since 0.15.0 - Separated from {@link NavigationEntryDescription}
 */
export interface NavigationEntryMenuDescription extends NavigationEntryDescription {

    /**
     * Children navigation entries. These will be added underneath this entry.
     * 
     * @expandType NavigationEntryDescription
     */
    pages?: Array<NavigationEntryDescription>

}



/**
 * UI Navigation Description.
 * 
 * @category Description
 * @since 0.15.0
 */
export interface VerticalNavigationDescription {

    /**
     * Navigation Menu Variant for this {@link BackendLayout | Backend}.
     */
    variant?: 'default'

    /**
     * Navigation structure for this {@link BackendLayout | Backend}.
     * 
     * @expandType NavigationEntryMenuDescription
     */
    menu: Array<NavigationEntryMenuDescription>
}



/**
 * UI Navigation Description.
 * 
 * @category Description
 * @since 0.15.0
 */
export interface HorizontalNavigationDescription {

    /**
     * Navigation Menu Variant for this {@link BackendLayout | Backend}.
     */
    variant: 'horizontal'

    /**
     * Navigation structure for this {@link BackendLayout | Backend}.
     * 
     * @expandType NavigationEntryDescription
     */
    menu: Array<NavigationEntryDescription>
}



/**
 * UI Navigation Description.
 * 
 * @category Description
 * @expandType HorizontalNavigationDescription
 * @expandType VerticalNavigationDescription
 * @since 0.15.0
 */
export type NavigationDescription = 
    HorizontalNavigationDescription
    | VerticalNavigationDescription;
