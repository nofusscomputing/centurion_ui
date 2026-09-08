import React, {
    useContext,
    useEffect,
    useId,
    useState
} from "react";

import {
    Form,
    useActionData,
    useFetcher,
    useLoaderData,
    useParams
} from "react-router";

import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    DescriptionList,
    Flex,
    PageSection,
    Sidebar,
    SidebarContent,
    SidebarPanel,
} from "@patternfly/react-core";

import '../styles/ticket.css'

import { Comments } from "../components/Comment";
import FieldData from "../functions/FieldData";
import { Fields } from "../components/DisplayFields";
import urlBuilder from "../hooks/urlBuilder";
import UserContext from "../hooks/UserContext";
import URLSanitize from "../functions/URLSanitize";
import CardDataSet from "../components/CardDataSet";
import {
    usePageContext
} from "../layouts/PageContent";


/**
 * 
 * @summary Converts seconds to Hours, Minutes Seconds.
 * 
 * @category Function
 * @since 0.1.0
 */
export function secondsToTime(secs) {

    const hour = 3600
    const minute = 60

    const hours = Math.floor( secs / hour )
    const minutes = Math.floor( ( secs % hour ) / minute )
    const seconds = Math.floor( secs % minute )


    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return String(`${obj['h']}h ${obj['m']}m ${obj['s']}s` );
}

/**
 * 
 * @summary Ticket Layout
 * 
 * @category Layout
 * @see [Ticket Layout - Demo Site](https://centurion-ui.nofusscomputing.com/layout/ticket/request/7)
 * @since 0.1.0
 */
const Ticket = (): React.JSX.Element => {

    const actionData = useActionData();

    const [comment_metadata, setCommentMetaData] = useState(null);

    const fetcher = useFetcher();

    const [ formState, setFormState ] = useState({});

    const {
        setPageDescription, setPageHeading, setPageHeaderIcons
    } = usePageContext();

    setPageDescription(null);
    setPageHeaderIcons(null);

    const [ editing_description, setEditingDescription ] = useState( false )

    const {page_data, metadata} = useLoaderData();

    const [ ticket_data, setTicketData] = useState(null)
    
    const [ ticket_metadata, setTicketMetaData] = useState(null)

    const [ ticket_type, SetTicketType ] = useState(null)

    const params = useParams();

    const url_params = urlBuilder(params);

    const [new_ticket, setNewTicket] = useState(
        url_params.params.action === 'add' ? true : false
    )

    const user = useContext(UserContext);


    useEffect(() => {

        if(actionData?.body && actionData?.ok) {

            setTicketData(actionData.body);

        }

    }, [actionData])


    useEffect(() => {

        document.title = `${metadata.name}`


    }, [ metadata ])

    useEffect( ()=> {

        setNewTicket(url_params.params.action === 'add' ? true : false)

    }, [
        url_params.params.action
    ])


    useEffect( () => {

        if( url_params.params.action !== 'add' ) {

            setTicketData(page_data)

            setPageHeading(page_data['title'])

        }else{
            setPageHeading('New ' + metadata.name)
        }

        setTicketMetaData(metadata)

    },[
        page_data,
        metadata,
    ])


    useEffect(() => {

        if( ticket_metadata?.name ) {

            let ticket_type_entry = String(ticket_metadata.name).toLowerCase()
            ticket_type_entry = ticket_type_entry.endsWith('s') ? ticket_type_entry.substring(0, (ticket_type_entry.length - 1)) : ticket_type_entry
            ticket_type_entry = ticket_type_entry.replace(' ', '-').replace('_', '-')

            SetTicketType(ticket_type_entry)

        }

    }, [
        metadata?.fields,
        ticket_metadata
    ])


    const handleDescriptionEdit = () => {

        setEditingDescription(!editing_description)

        if( ! editing_description ) {

            setFormState({})

        }
    }


    const ticketElementIdRandom = useId()

    const ticketElementId = () => {

        if( new_ticket ) {

            return ticketElementIdRandom

        } else {

            return ticket_data.id

        }
    }

    console.debug(`ticket form data: ${JSON.stringify( formState )}`)

    const [ ticketDescriptionState, setTicketDescriptionState ] = useState({});

    const ticketDescriptionCard = (
        ticket_metadata &&
        <Card
            isCompact
        >
            <CardHeader>
                {
                ! new_ticket &&
                (
                    <>
                    <span>
                        <span className="sub-script">opened by&nbsp;</span>
                        <FieldData
                            metadata={ticket_metadata}
                            field_name='opened_by'
                            data={ticket_data}
                        />
                    </span>&nbsp;
                    <span>
                        <span className="sub-script">on&nbsp;</span> 
                        <FieldData
                            metadata={ticket_metadata}
                            field_name='created'
                            data={ticket_data}
                        />
                    </span>&nbsp;
                    <span>
                    <span className="sub-script">Updated&nbsp;</span> 
                    <FieldData
                        metadata={ticket_metadata}
                        field_name='modified'
                        data={ticket_data}
                    />
                    </span>
                </>)

                }
            </CardHeader>
            <CardBody>

                <Fields
                    // errorState={actionData}
                    fields = {[
                        new_ticket && 'title',
                        'description',
                    ].filter(Boolean)}
                    formState={new_ticket ? formState : ticketDescriptionState }
                    isCreate={new_ticket}
                    isEdit={editing_description}
                    isFlex = {true}
                    objectData={ticket_data}
                    objectMetadata={ticket_metadata}
                    onChange={new_ticket ? setFormState : setTicketDescriptionState }
                />

            </CardBody>
            <CardFooter>
                { ! new_ticket &&
                <>
                    <Button
                        variant={editing_description ? "secondary" : "primary"}
                        onClick={handleDescriptionEdit}
                    >
                        <>{editing_description ? "Cancel" : "Edit"}</>

                    </Button>
                    { editing_description && <Button type="submit" variant="primary">Save</Button>}
                </>
                }
                { new_ticket && <Button type="submit" variant="primary">Save</Button>}
            </CardFooter>
        </Card>

    );


    const ticketLayout = (
        <PageSection
            className = "ticket"
            padding={{ default: 'noPadding'}}
        >
            <Sidebar
                hasBorder
                isPanelRight
                
            >
                <SidebarContent>
                    <PageSection
                        style={{
                            backgroundColor: "var(--pf-t--global--background--color--control--default)",
                        }}
                    >

                        <Flex
                            direction={{ default: 'column' }}
                            grow={{ default: 'grow' }}
                            rowGap={{ default: 'rowGapMd' }}
                        >

                            { ticket_metadata && 
                            <>
                                {editing_description && 
                                    <fetcher.Form
                                        className = "pf-v6-c-form pf-m-vertical"
                                        id={'create-' + ticketElementId()}
                                        method="PATCH"
                                        action={String(document.location.href).replace(document.location.origin, '')}
                                        onSubmit={(e) => {
                                            
                                            setFormState({})
                                            setTicketDescriptionState({})
                                            setEditingDescription(!editing_description)
                                        }}
                                    >
                                        {ticketDescriptionCard}

                                        <input id="metadata" type="hidden" name="metadata" value={JSON.stringify(ticket_metadata)} />
                                        <input id="tz" type="hidden" name="tz" value={user.settings.timezone} />
                                    </fetcher.Form>}

                                {!editing_description &&
                                    ticketDescriptionCard}

                                { ! new_ticket &&
                                <>

                                <CardDataSet
                                    hasRowDelete = {true}
                                    isExpandable = {true}
                                    url = { URLSanitize(ticket_data?._urls?.ticket_dependencies) }
                                />

                                <CardDataSet
                                    hasRowDelete = {true}
                                    isExpandable = {true}
                                    url = { URLSanitize(ticket_data?._urls?.linked_models) }
                                />

                                <Comments
                                    comments_url = {URLSanitize(ticket_data?._urls?.comments)}
                                />
                                </>}
                            </>}

                        </Flex>

                    </PageSection>
                </SidebarContent>
                <SidebarPanel
                    hasPadding
                    variant="sticky"
                >

                    <Flex
                        direction={{ default: 'column' }}
                        grow={{ default: 'grow' }}
                        style={{
                            minWidth: "300px",
                            overflow: "hidden",
                        }}
                    >

                        <DescriptionList
                            style={{
                                maxHeight: "calc(100svh - 69px - 53px - 21px - 15px - 90px)",
                                minHeight: "0",
                                overflowY: "auto",
                                scrollbarWidth: "thin",

                            }}
                        >

                        {ticket_metadata &&
                        <Fields
                                fields = {[
                                    'organization',
                                    !new_ticket && 'assigned_to',
                                    'status_badge',
                                    'category',
                                    'project',
                                    'milestone',
                                    // secondsToTime(ticket_data['duration']),
                                    !new_ticket && 'ticket_duration',
                                    'urgency_badge',
                                    'impact_badge',
                                    'priority_badge',
                                    !new_ticket && 'ticket_estimation',
                                    'planned_start_date',
                                    'real_start_date',
                                    'planned_finish_date',
                                    'real_finish_date',
                                    !new_ticket && 'subscribed_to',
                                ].filter(Boolean)}
                                formComponent = {fetcher.Form}
                                formState={formState}
                                isCreate={new_ticket}
                                isEdit={false}
                                objectData={ticket_data}
                                objectMetadata={ticket_metadata}
                                onChange={setFormState}
                                useDivider={true}
                            />}

                        </DescriptionList>
                    </Flex>

                </SidebarPanel>
            </Sidebar>
        </PageSection>
    );


    if( new_ticket ) {

        return (
            <fetcher.Form
                className = "pf-v6-c-form pf-m-vertical"
                id={'create-' + ticketElementId()} method="POST" action={String(document.location.href).replace(document.location.origin, '')}
                onSubmit={(e) => {
                    setFormState({})
                }}
            >
                {ticketLayout}

                <input id="metadata" type="hidden" name="metadata" value={JSON.stringify(ticket_metadata)} />
                <input id="tz" type="hidden" name="tz" value={user.settings.timezone} />
            </fetcher.Form>
        )
    } else {


        return (
            <>
                {ticketLayout}
            </>
        )

    }
}

export default Ticket;
