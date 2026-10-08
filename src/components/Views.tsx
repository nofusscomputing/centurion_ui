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
    SidebarPanel,
    TabContent,
    Tabs,
    TabTitleText
} from "@patternfly/react-core";

import { Tab } from '../components/Tabs'



/**
 * 
 * @since 0.15.0
 */
export enum CardLayout {

    grid = 'grid',

    column = 'column'

}



/**
 * Tab content to display within the view.
 * 
 * @category .
 * @since  0.15.0
 */
export interface pageTabs {

    /**
     * Name of the tab.
     */
    name: string

    /**
     * URL link for tab.
     */
    link: string

    /**
     * ref of tab.
     */
    ref: React.RefObject<any>

    /**
     * Tab Content to render.
     */
    content: React.JSX.Element
}



/**
 * Context for Views.
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
     * Tabs for the view.
     */
    tabs: Array<pageTabs>

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
     * Sets the value that will be used within the sidebar, if a sidebar view
     * is to be used.
     */
    setSidebarContent: React.Dispatch<React.SetStateAction<React.ReactNode>>

    /**
     * Sets the value of the tabs that will be rendered within the view.
     */
    setTabs: React.Dispatch<React.SetStateAction<Array<pageTabs>>>

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
 * View that uses tabs.
 * 
 * @category View
 * @since 0.15.0
 */
export const TabsView = (): React.JSX.Element => {

    const {
        tabs
    } = useContext(viewsContext);

    const [activeTabKey, setActiveTabKey] = useState('');

    const handleTabClick = (_, tabIndex) => {
        setActiveTabKey(tabIndex);
    };

    return (
        <>
        <PageSection
            className="pf-m-sticky-top"
            isFilled = {true}
            padding = {{ default: 'noPadding'}}
            type="tabs"
        >

            <Tabs
                activeKey = {activeTabKey}
                aria-label = "page-tabs"
                onSelect = {handleTabClick}
                usePageInsets
                isNav = {tabs ? Object.hasOwn(tabs[0], 'link') : false}
            >

                {tabs && tabs.map(( tab, index ) => {
                
                    if(
                        String(location.pathname).endsWith('/add')
                        && index !== 0
                    ) {
                        return;
                    }

                    const currentTabKey = String(tab.name).toLowerCase().replace(' ' , '_')

                    if( activeTabKey === '' && index === 0 ) setActiveTabKey(currentTabKey);


                    return (
                        <Tab
                            eventKey = {currentTabKey}
                            href = { tab.link ? tab.link : undefined }
                            key = {currentTabKey}
                            tabContentId = {`tab${index}`}
                            tabContentRef = {tab.ref} 
                            title = {
                                <TabTitleText>{tab.name}</TabTitleText>
                            }
                        />
                    );

                })}

            </Tabs>
        </PageSection>

        <PageSection
            isFilled={true}
            padding = {{ default: 'noPadding'}}
        >
            { tabs && tabs.map((tab, index) => {

                const currentTabKey = String(tab.name).toLowerCase().replace(' ' , '_')

                return (
                    <TabContent
                        aria-label = {`tab ${index}`}
                        eventKey = {index}
                        hidden = {activeTabKey !== currentTabKey}
                        id = {`tab${index}`}
                        key = {index}
                        ref = {tab.ref}
                    >

                        {activeTabKey == currentTabKey && tab.content}

                    </TabContent>
                );

            })}
        </PageSection>
        </>
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
 * @see [Sidebar Example in Ticket - Demo Site](https://centurion-ui.nofusscomputing.com/layout/ticket/request/1)
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
                <TabsView />
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

    const [ pageContent, setPageContent ] = useState<React.ReactElement>(<></>);

    const [ sidebarContent, setSidebarContent ] = useState<React.ReactElement>(<></>);

    const [ tabs, setTabs ] = useState<Array<pageTabs>>(null);

    return (
        <viewsContext.Provider
            value = {{
                cardLayout, setCardLayout,
                isCardContent, setIsCardContent,
                pageContent, setPageContent,
                sidebarContent, setSidebarContent,
                tabs, setTabs
            }}
        >
            {children}
        </viewsContext.Provider>
    );
};
