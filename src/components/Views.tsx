import { Flex, Gallery, PageSection, Sidebar, SidebarContent, SidebarPanel } from "@patternfly/react-core";
import { createContext, useContext, useState } from "react";



/**
 * 
 * @since 0.15.0
 */
export enum CardLayout {

    grid = 'grid',

    column = 'column'

}



/**
 * 
 * @category Context
 * @since 0.15.0
 */
export const viewsContext = createContext(null);



const CardContent = ({ children }) => {

    const {
        cardLayout,
        isCardContent
    } = useContext(viewsContext);

    return (
        <>
        { cardLayout == CardLayout.column &&

            <Flex
                direction={{ default: 'column' }}
                grow={{ default: 'grow' }}
                rowGap={{ default: 'rowGapMd' }}
                style={{
                    backgroundColor: "transparent",
                }}
            >
                {children}
            </Flex>
        }
        { cardLayout == CardLayout.grid &&
            <Gallery
                hasGutter
                style={{
                    backgroundColor: "transparent",
                }}
            >
                {children}
            </Gallery>
        }
        </>
    );
};



/**
 * View that contains a sidebar.
 * 
 * @category View
 * @since 0.15.0
 */
export const SidebarView = () => {

    const {
        cardLayout,
        isCardContent,
        sidebarContent,
        pageContent,
    } = useContext(viewsContext);

    return (
        <Sidebar
            hasGutter = {false}
            isPanelRight = {true}
        >

            <SidebarContent
                hasPadding = {true}
                style={isCardContent ? {
                    backgroundColor: "transparent",
                } :{}}
            >
                { ! isCardContent && pageContent}

                { isCardContent &&
                <CardContent>
                    {pageContent}
                </CardContent>
                }

            </SidebarContent>

            <SidebarPanel
                aria-label = "Page Sidebar"
                hasPadding = {isCardContent && cardLayout == CardLayout.column }
                variant = "sticky"
            >
                {sidebarContent}
            </SidebarPanel>

        </Sidebar>
    );
};



/**
 * Selector for which view to use.
 * 
 * @category 
 * @since 0.15.0
 */
export enum ViewsVariant {

    /**
     * Default View.
     */
    plain = 'plain',

    /**
     * Sidebar View.
     */
    sidebar = 'sidebar',

    /**
     * Tabbed View.
     */
    tabs = 'tabs'

}



/**
 * Props for view
 * 
 * @category Props
 * @since 0.15.0
 */
export interface ViewsProps {

    /**
     * What view should be used
     */
    variant?: ViewsVariant
}



/**
 * This layout sets up the page layout, also known as a "View." Setup of view
 * requires that you set the appropriate values as part of the
 * {@link viewsContext}.
 * 
 * @summary Dynamic Views Layout
 * 
 * @category Layout
 * @expandType ViewsProps
 * @since 0.15.0
 */
const Views = ({
    variant = ViewsVariant.plain
}: ViewsProps) => {

    const {
        cardLayout,
        isCardContent, pageContent
    } = useContext(viewsContext);

    return (
        
        <PageSection
            isFilled = {true}
            padding={isCardContent && cardLayout == CardLayout.grid ? {} : { default: 'noPadding'}}

            style={isCardContent ? {
                backgroundColor: "var(--pf-t--global--background--color--control--default)",
            } :{}}
        >
            {variant == ViewsVariant.plain &&
                <>
                    { !isCardContent && pageContent}

                    { isCardContent && <CardContent>{pageContent}</CardContent>}
                </>
            }
            {variant == ViewsVariant.sidebar &&
                <SidebarView />
            }
            {variant == ViewsVariant.tabs &&
                <></>
            }
        </PageSection>
    );
};

export default Views



/**
 * This context provider contains the state for the view that is being used.
 * 
 * @category Provider
 * @since 0.15.0
 */
export const ViewsProvider = ({
    children
}) => {

    const [ cardLayout, setCardLayout ] = useState(CardLayout.grid);

    const [ isCardContent, setIsCardContent ] = useState(false);

    const [ sidebarContent, setSidebarContent ] = useState(<></>);

    const [ pageContent, setPageContent ] = useState(<></>);

    return (
        <viewsContext.Provider
            value = {{
                cardLayout, setCardLayout,
                isCardContent, setIsCardContent,
                pageContent, setPageContent,
                sidebarContent, setSidebarContent,
            }}
        >
            {children}
        </viewsContext.Provider>
    );
};
