import React, {
    createContext,
    useContext,
    useState
} from "react";

import {
    Card,
    Flex,
    Gallery,
    PageSection,
    Sidebar,
    SidebarContent,
    SidebarPanel
} from "@patternfly/react-core";



/**
 * 
 * @since 0.15.0
 */
export enum CardLayout {

    grid = 'grid',

    column = 'column'

}



/**
 * dsfds
 * 
 * @category Context
 * @since 0.15.0
 */
export interface ViewsContext {

    /**
     * What layout to use for the cards.
     * 
     * @expandType CardLayout
     */
    cardLayout: CardLayout

    /**
     * Is the content to be layout cards.
     */
    isCardContent: boolean

    /**
     * Content that will be rendered as the "page"
     */
    pageContent: React.JSX.Element

    /**
     * Set the CardLayout value.
     */
    setCardLayout: React.Dispatch<React.SetStateAction<CardLayout>>

    /**
     * Set the value of if this view is for cards.
     */
    setIsCardContent: React.Dispatch<React.SetStateAction<boolean>>

    /**
     * Sets the value that will be used for the page content.
     */
    setPageContent: React.Dispatch<React.SetStateAction<React.ReactNode>>

    /**
     * Sets the value that will be used within the sidebar, if a sidbar view
     * is to be used.
     */
    setSidebarContent: React.Dispatch<React.SetStateAction<React.ReactNode>>

    /**
     * Content that will be rendered in the sidebar.
     */
    sidebarContent: React.JSX.Element
    
}



/**
 * 
 * @category Context
 * @expandType ViewsContext
 * @since 0.15.0
 */
export const viewsContext = createContext<ViewsContext>(null);



/**
 * Props for CardContent
 * 
 * @category Props
 * @since 0.15.0
 */
export interface CardContentProps {

    /**
     * Cards to render.
     */
    children: React.ReactElement<Array<typeof Card> | typeof Card>
}


/**
 * 
 * @category Component
 * @internal
 * @since 0.15.0
 */
const CardContent = ({
    children
}: CardContentProps ): React.JSX.Element => {

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
 * @internal
 * @since 0.15.0
 */
export const SidebarView = (): React.JSX.Element => {

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
 * View content be set to be for cards or not.
 * 
 * @summary Dynamic Views Layout
 * 
 * @category Component
 * @expandType ViewsProps
 * @since 0.15.0
 */
const Views = ({
    variant = ViewsVariant.plain
}: ViewsProps): React.JSX.Element => {

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
 * This context provider contains the context from {@link viewsContext} for the
 * view that is being used.
 * 
 * You do not need to define this provider as it is defined as part of
 * {@link PageContent}
 * 
 * @category Provider
 * @since 0.15.0
 */
export const ViewsProvider = ({
    children
}): React.JSX.Element => {

    const [ cardLayout, setCardLayout ] = useState<CardLayout>(CardLayout.grid);

    const [ isCardContent, setIsCardContent ] = useState<boolean>(false);

    const [ sidebarContent, setSidebarContent ] = useState<React.ReactElement>(<></>);

    const [ pageContent, setPageContent ] = useState<React.ReactElement>(<></>);

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
