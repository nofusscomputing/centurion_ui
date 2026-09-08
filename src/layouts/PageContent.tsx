import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    Link,
    Outlet,
    useNavigation,
    useParams
} from "react-router";

import {
    BackToTop,
    Breadcrumb,
    BreadcrumbHeading,
    BreadcrumbItem,
    Divider,
    Flex,
    FlexItem,
    PageGroup,
    PageSection,
    Skeleton,
    Title
} from "@patternfly/react-core";



/**
 * Provides context for {@link PageContent} so that children can set the
 * content page heading, description and icons.
 * 
 * @summary Context for {@link PageContent}.
 * 
 * @category Context
 * @since 0.13.0
 */
export type PageContext = {

    /**
     * Additional PageSection to be used as to append to page footer.
     */
    setAdditionalPageFooter: React.Dispatch<React.SetStateAction<React.JSX.Element>>

    /**
     * Text to use a page description that is displayed under the page title.
     */
    setPageDescription: React.Dispatch<React.SetStateAction<string>>

    /**
     * Text to use as the page head / title
     */
    setPageHeading: React.Dispatch<React.SetStateAction<string>>

    /**
     * Icons to display as part of the page header.
     */
    setPageHeaderIcons: React.Dispatch<React.SetStateAction<string>>

}



const pageContext = createContext<PageContext>(null);



/**
 * This route view provides the common elements for the page content area.
 * There is context that accompanies this component that can be accessed via
 * {@link usePageContext}.
 * 
 * @summary Route Layout for page content.
 * 
 * @category Layout
 * @since 0.13.0
 */
const PageContent = (): React.JSX.Element => {

    const [ additionalPageFooter, setAdditionalPageFooter ] = useState(null);

    const params = useParams();

    const navigation = useNavigation();

    const [ pageHeading, setPageHeading ] = useState<string>(null);

    const [ pageDescription, setPageDescription ] = useState<string>(null);

    const [ pageHeaderIcons, setPageHeaderIcons ] = useState(null);

    document.title = `${pageHeading}`


    useEffect(() => {

            setAdditionalPageFooter(null)

    }, [ document.location.pathname ]);
    

    const rootPageBreadcrumb = (

        <Breadcrumb>

            <BreadcrumbItem>{params.module}</BreadcrumbItem>

            <BreadcrumbItem
                to={`/${params.module}/${params.model}`}
                component = {(props) => <Link {...props} to={props.href} />}
            >
                {params.model}
            </BreadcrumbItem>

            {(params?.ticket_sub_model || params?.sub_model) &&
            <BreadcrumbItem
                to={`/${params.module}/${params.model}/${params.pk}`}
                component = {(props) => <Link {...props} to={props.href} />}
            >
                {params.pk}
            </BreadcrumbItem> }

            {params?.sub_model && <BreadcrumbItem>{params.sub_model}</BreadcrumbItem>}

            {params?.ticket_sub_model && <BreadcrumbItem>{params.ticket_sub_model}</BreadcrumbItem>}

            {(params?.ticket_sub_model || params?.sub_model) && <BreadcrumbHeading>{pageHeading}</BreadcrumbHeading>}

            {params.pk && ! params?.sub_model && ! params?.ticket_sub_model &&
            <BreadcrumbHeading to="#">{params.pk && pageHeading}</BreadcrumbHeading>}

        </Breadcrumb>
    );

    return (
        <pageContext.Provider value = {{
            setAdditionalPageFooter: setAdditionalPageFooter,
            setPageDescription: setPageDescription,
            setPageHeaderIcons: setPageHeaderIcons,
            setPageHeading: setPageHeading
        }} >

            <PageSection
                className="pf-m-sticky-top"
                type="breadcrumb"
            >
                {rootPageBreadcrumb}
            </PageSection>

            <PageGroup
                aria-label="Page"
                id="page-main"
                hasOverflowScroll
            >
                <PageSection
                >
                    <Flex
                        rowGap={{ default: 'rowGapNone' }}
                    >
                        <Flex
                            fullWidth={{ default: 'fullWidth'}}
                        >
                            <FlexItem
                                grow = {{ default: 'grow'}}
                            >

                                <Title
                                    headingLevel="h1"
                                >
                                    { navigation.state === "idle" ? pageHeading : <Skeleton />}
                                </Title>

                            </FlexItem>

                            <FlexItem
                                align={{ default: 'alignRight'}}
                            >

                                {pageHeaderIcons}

                            </FlexItem>

                        </Flex>

                        <Divider />

                        <FlexItem
                            fullWidth={{ default: 'fullWidth'}}
                            grow = {{ default: 'grow'}}
                        >
                        
                            { navigation.state === "idle" ? pageDescription : <Skeleton />}
                        
                        </FlexItem>

                    </Flex>

                </PageSection>

                <PageSection isFilled={true}>

                    <Outlet />

                </PageSection>

                { additionalPageFooter && additionalPageFooter }

                <PageSection
                    aria-labelledby = "Page Footer"
                    component = "footer"
                    variant="secondary"
                    style={{
                        // display: "flex",
                        textAlign: "center"
                    }}
                >

                    <p>Centurion UI brought to you by <a href="https://nofusscomputing.com" target="new">No Fuss Computing</a></p>
                    
                </PageSection>

            </PageGroup>
            <BackToTop scrollableSelector="#page-main" />

        </pageContext.Provider>
    );
}


/**
 * 
 * @summary Page Context..
 * 
 * @category Hook
 * @expandType PageContext
 * @since 0.13.0
 */
export const usePageContext = (): PageContext => {

    return useContext(pageContext);

}

export default PageContent;
