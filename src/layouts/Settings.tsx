
import {
    useContext,
    useEffect,
} from "react";

import {
    Link,
    useLoaderData,
} from "react-router"

import {
    Card,
    CardBody,
    CardTitle,
} from "@patternfly/react-core";

import IconLoader from "../components/IconLoader";
import
    Views,
    {
        viewsContext,
        ViewsVariant
} from "../components/Views";

import URLSanitize from "../functions/URLSanitize";

import {
    usePageContext
} from "../layouts/PageContent";

import {
    apiObject
} from "../types/backend/apiObject/object";
import {
    apiMetadata
} from "../types/backend/apiMetadata/metadata";


/**
 * 
 * @summary Settings layout component
 * 
 * @category Layout
 * @since 0.1.0
 */
const Settings = (): React.JSX.Element => {

    const {metadata, page_data} = useLoaderData<{metadata: apiMetadata, page_data: apiObject}>();

    const {
        setPageDescription, setPageHeading, setPageHeaderIcons
    } = usePageContext()


    useEffect(() => {

        setPageHeading('Settings')
        setPageDescription(metadata.description)

        setPageHeaderIcons(
            <>
                {metadata['documentation'] &&
                    <Link to={metadata['documentation']} target="_new">
                        <IconLoader
                            name='help'
                        />
                    </Link>
                }
            </>
        )

    },[])


    const {
        setIsCardContent,
        sidebarContent, setSidebarContent,
        pageContent, setPageContent
    } = useContext(viewsContext);

    useEffect(() => {

        if( metadata ) {

            setPageContent(
                <>
                    {metadata.layout['card'].map((card) => {
                        return (
                            <Card>
                            <CardTitle>{card.title}</CardTitle>
                            <CardBody>
                                <ul>
                                    {card.body.map((link) => 
                                        (<li>{page_data && <Link to={URLSanitize(page_data[link.model])}>{link.name}</Link>}</li>)
                                    )}
                                </ul>
                            </CardBody>
                            </Card>
                        );
                    })}
                </>
            );

            setIsCardContent(true);
        }

    },[
        metadata
    ]);

    return (
        <Views
            variant = {ViewsVariant.plain}
        />
    );
}

export default Settings;
