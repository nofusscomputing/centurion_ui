
import {
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
    Gallery,
    PageSection
} from "@patternfly/react-core";

import IconLoader from "../components/IconLoader";
import URLSanitize from "../functions/URLSanitize";

import {
    usePageContext
} from "../layouts/PageContent";
import { apiObject } from "../types/backend/apiObject/object";


/**
 * 
 * @summary Settings layout compontnt
 * 
 * @category Layout
 * @since 0.1.0
 */
const Settings = (): React.JSX.Element => {

    const {metadata, page_data} = useLoaderData<{metadata: APIMetadata, page_data: apiObject}>();

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


    return (
        <PageSection
            isFilled = {true}
        >

            {metadata && page_data &&

                <Gallery hasGutter role="region" aria-label="Selectable card container">
                    {metadata.layout.card.map((card) => {
                        return (
                            <Card>
                            <CardTitle>{card.title}</CardTitle>
                            <CardBody>
                                <ul>
                                    {card.body.map((link) => 
                                        (<li><Link to={URLSanitize(page_data[link.model])}>{link.name}</Link></li>)
                                    )}
                                </ul>
                            </CardBody>
                            </Card>
                        );
                    })}
                </Gallery>

            }

        </PageSection>
    );
}

export default Settings;
