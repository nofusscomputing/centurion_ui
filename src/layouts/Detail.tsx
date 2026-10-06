import React, {
    createRef,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link,
    useFetcher,
    useLoaderData,
    useLocation,
    useNavigate,
} from "react-router";

import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Divider,
    Flex,
    FlexItem,
} from "@patternfly/react-core";

import '../styles/detail.css'

import IconLoader from "../components/IconLoader";
import ModelNote from "../components/page/detail/ModelNote";
import DetailSection from "../components/page/detail/DetailSection";
import MarkdownEditor from "../components/MarkdownEditor";
import
    Views,
    {
        viewsContext,
        ViewsVariant
} from "../components/Views";

import URLSanitize from "../functions/URLSanitize";

import UserContext from "../hooks/UserContext";

import {
    usePageContext
} from "../layouts/PageContent";



/**
 * Detail Layout is for displaying a single object from a dataset. The object
 * is obtained from the backend via a {@link apiObject}.
 * 
 * This view also provides for creating a new object. This is done by ensuring
 * that the tail of the url is `/add`. When this layout detects this, you will
 * be provided the form fields that are used to create the new object.
 * 
 * @summary Provides the layout for a single object.
 * 
 * @category Layout
 * @see {@link apiObject} for backend object structure.
 * @see {@link layoutDetail} for describing this layout.
 * @see [Detail Layout - Demo Site](https://centurion-ui.nofusscomputing.com/layout/detail/1)
 * @since 0.14.0
 */
const DetailLayout = (): React.JSX.Element => {


    const {
        setPageDescription, setPageHeading, setPageHeaderIcons
    } = usePageContext();

    const {
        tabs, setTabs
    } = useContext(viewsContext);

    const fetcher = useFetcher();

    const location = useLocation();

    const {metadata, page_data} = useLoaderData();

    const navigate = useNavigate();


    const [ notes, setNotes ] = useState(null)
    const [ update_notes, setUpdateNotes ] = useState(false)
    const [ notes_form, setNotesForm ] = useState({})
    const [ note_metadata, setNoteMetadata ] = useState(null)


    const user = useContext(UserContext);

    useEffect(() => {

        let a = fetcher;

        if(
            fetcher.data?.body?._urls?._self
            && fetcher.data?.ok
            && String(fetcher.formAction).endsWith('/add')
        ) {

            navigate( URLSanitize(fetcher.data.body._urls._self));

        }

    }, [fetcher])

    useEffect(() => {

        document.title = `${metadata.name}`

    }, [ metadata ])


    useEffect(() => {

        if( ! String(location.pathname).endsWith('/add') && 'name' in page_data ) {

            setPageHeading(page_data['name']);

        }else if( ! String(location.pathname).endsWith('/add') && 'title' in page_data ) {

            setPageHeading(page_data['title']);

        }else{
            setPageHeading(metadata['name']);
        }

        setPageDescription(metadata['description'])


        if( ! String(location.pathname).endsWith('/add') ) {

            setPageHeaderIcons(
                <>
                    { ('documentation' in metadata) &&
                        <Link to={metadata['documentation']} target="_new">
                            <IconLoader
                                name='help'
                                size="xl"
                            />
                        </Link>
                    }
                    {(! String(page_data).includes('results') || '_urls' in page_data) && page_data['_urls']['history'] &&
                        <Link to={URLSanitize(page_data['_urls']['history'])}>
                            <IconLoader
                                name='history'
                                size="xl"
                            />
                        </Link>
                    }
                    {metadata['allowed_methods'].includes('DELETE') &&
                        <Link to={URLSanitize(page_data['_urls']['_self']) + '/delete'}>
                            <IconLoader
                                name='delete'
                                size="xl"
                            />
                        </Link>
                    }
                </>
            )
        }

    },[
        page_data,
        metadata
    ])


    useEffect(() => {

        if( String(location.pathname).endsWith('/add') || 'results' in page_data ) {
            return
        }

        if( Object.keys(page_data['_urls']).includes('notes') ) {

            const {api_metadata, api_page_data} = apiFetch(
                URLSanitize(page_data['_urls']['notes']),
            )

                .then((data) =>{

                    setNotes(data.api_page_data)

                    setNoteMetadata(data.api_metadata)

                })

        }

    }, [
        page_data,
        update_notes,
    ])


    const tabDetails = useMemo(() => {

        return metadata.layout.detail.map(( tab, index ) => {

            let metadataTab = metadata.layout.detail[index]

            let page_content

            if( tab.name.toLowerCase() === 'notes' ) {

                page_content = (
                    <Flex
                        direction={{ default: "column" }}
                    >

                        <FlexItem>

                            <Card isPlain>

                                <fetcher.Form
                                    method = "POST"
                                    action = {URLSanitize(page_data['_urls']['notes'])}
                                >
                                    <CardBody>
                                        <MarkdownEditor
                                            id = 'body'
                                            grow = {true}
                                            isRequired = {true}
                                            name = "body"
                                            // onChange = {(e) => {
                                            //     setNotesForm((prevState) => ({ 
                                            //         ...prevState,
                                            //         body: e.target.value,
                                            //     }
                                            //     ))

                                            //     console.log(`model note form ${JSON.stringify(notes_form)}`)
                                            // }}
                                            value={notes_form?.body}
                                        />
                                    </CardBody>
                                    <CardFooter>
                                        <Button variant="primary" type="submit">Create Note</Button>
                                    </CardFooter>

                                    <input id="metadata" type="hidden" name="metadata" value={JSON.stringify(note_metadata)} />
                                    <input id="tz" type="hidden" name="tz" value={user.settings.timezone} />
                                </fetcher.Form>
                            </Card>
                        </FlexItem>

                        <FlexItem><Divider /></FlexItem>

                        {notes && note_metadata && notes.results.map((note) => {
                            return (
                                <>
                                    <FlexItem>
                                        <ModelNote
                                            note_data={note}
                                            metadata = {note_metadata}
                                        />
                                    </FlexItem>
                                    <Divider />
                                </>
                            );
                        })}
                    </Flex>
                )

            } else {

                page_content = metadataTab.sections.map(( section, section_index ) => {

                    if(
                        String(location.pathname).endsWith('/add')
                        && section_index !== 0
                    ) {
                        return;
                    }

                    return (
                        <>
                            {section_index !== 0 && <Divider />}

                            <FlexItem>
                                <DetailSection
                                    FormComponent = {fetcher.Form}
                                    index = { section_index }
                                    layout = {section}
                                    data = { page_data }
                                    metadata = { metadata }
                                    name = {tab.name}
                                />
                            </FlexItem>
                        </>
                    );
                })
            }

            return {
                name: tab.name,
                ref: createRef(),
                content: page_content
            }
        });

    }, [
        metadata.layout.detail,
        notes,
        note_metadata,
        user
    ])

    setTabs(tabDetails)


    return (
        <>
            <Views variant = {ViewsVariant.tabs} />
        </>
    );

};

export default DetailLayout;
