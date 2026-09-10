import React, {
    useContext,
    useEffect,
    useState
} from "react"

import {
    Form,
    useFetcher
} from "react-router"

import {
    AlertVariant,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownList,
    ExpandableSection,
    Flex,
    FlexItem,
    List,
    MenuToggle,
    Skeleton,
    Title
} from "@patternfly/react-core"

import {
    EllipsisVIcon,
    OutlinedCommentIcon,
    OutlinedCommentsIcon,
} from '@patternfly/react-icons';

import {apiFetch } from "../hooks/apiFetch"
import FieldData from "../functions/FieldData"
import { Fields } from "./DisplayFields"
import IconLoader from "./IconLoader"

import UserContext from "../hooks/UserContext"
import URLSanitize from "../functions/URLSanitize";
import ListItem from "./ListItem";
import { useNotificationActions } from "../hooks/useNotificationActions";
import { apiObject } from "../types/backend/apiObject/object";



/**
 * 
 * @summary Props for Comments component.
 * 
 * @category Props
 * @since 0.1.0
 */
export type CommentsProps = {

    /**
     * URL to Fetch comments from.
     */
    comments_url: string
}



/** 
 * This component is self contained and is only dependant upon the comments
 * url.
 * 
 * Will make an initial HTTP/OPTIONS request to the comments URL to fetch the
 * base models metadata. Once obtained will make a HTTP/GET request to the
 * comments url fetching all comments. This request is paginated, and will loop
 * through and fetch every responses `links.next` url until its value is `null`.
 * 
 * Each comment will then be rendered via the Comment component.
 * 
 * @summary List of Comments
 * 
 * @category Component
 * @since 0.1.0
 */
export const Comments = ({
    comments_url,
}: CommentsProps): React.JSX.Element => {

    const { addNewNotification } = useNotificationActions();

    const fetcher = useFetcher();

    const [ metadata, setCommentMetadata ] = useState( null )

    const [comments, setComments] = useState({
        fetch_url: comments_url,
        comments: null
    });

    const [ reload, setRelaod ] = useState(false);


    /**
     * ToDo: Add check to see if was an edit (HTTP/PATCH), if yes, from http
     * response update existing object with the same ID.
     * 
     * ToDo: If an error, display the errors near the field.
     * 
     * ToDo: once above two done, remove Comment component callbacks
     */
    useEffect(() => {

        if( Object.hasOwn(fetcher.data ?? {}, 'body') && Object.hasOwn(fetcher.data ?? {}, 'ok')) {

            console.debug('fetcher return', fetcher.data);

            if( fetcher.data.status_code === 201 ) {

                setComments((prevState) => ({
                    fetch_url: prevState.fetch_url,
                    comments: {
                        ...prevState.comments,
                        [fetcher.data.body.id]: fetcher.data.body
                    }
                }));

            } else if( fetcher.data.status_code === 200 ) {

                if( String(fetcher.data.method).toLowerCase() == 'post' ) {

                    setRelaod(true);

                }else if( String(fetcher.data.method).toLowerCase() == 'patch' ) {

                    setComments((prevState) => ({
                        fetch_url: prevState.fetch_url,
                        comments : Object.fromEntries(
                            Object.entries(prevState.comments).map(
                                ([key, value]) => {

                                    if( fetcher.data.body.id == key ) {
                                        value = fetcher.data.body
                                    }
                                    
                                    return [key, value]
                                }
                            )
                        )
                    }));
                }
            }

            if( fetcher.data.errors?.message ) {

                addNewNotification(
                    "Form not submitted",
                    fetcher.data.errors.message,
                    AlertVariant.danger,
                    true
                    
                )
        
            }
        }

    }, [
        fetcher.data
    ]);



    useEffect(() => {

        if( reload || comments.comments === null && metadata ) {

            let url = comments.fetch_url

            // eslint-disable-next-line
            async function do_fetch() {

                do {

                    await apiFetch(
                        url,
                        null,
                        "GET",
                        undefined,
                        false
                    )
                        .then((response) => {

                            response.api_page_data.results.map(( comment ) => {
            
                                setComments((prevState) => ({
                                    fetch_url: response.api_page_data.links.next ? response.api_page_data.links.next : prevState.fetch_url,
                                    comments: {
                                        ...prevState.comments,
                                        [comment.id]: comment
                                    }
                                }))
            
                            })
            
                            url = response.api_page_data.links.next
            
                        })

                } while( url );

            }

            do_fetch();

            setRelaod(false)
        }

    }, [
        comments_url,
        metadata,
        reload,
    ])

    useEffect(() => {

        if( ! metadata ) {

            // eslint-disable-next-line
            async function do_fetch() {

                await apiFetch(
                    comments_url,
                    null,
                    'OPTIONS'
                )
                    .then((result) => {

                        if( result.status === 200 ) {

                            if( result.api_metadata !== null ) {

                                setCommentMetadata(result.api_metadata)
            
                            }
                        }
                    })
            };

            do_fetch();

        }

    }, [])


    return (
        comments &&
        <>
        <Flex
            direction={{ default: 'column' }}
        >
            <List
                isPlain
                iconSize="large"
                // isBordered
            >
                {comments.comments &&
                Object.keys(comments.comments).map(key => {

                        const need_metadata = () => {
                    
                            let needs_metadata = true

                            let url = URLSanitize(comments.comments[key]['_urls']['_self']).endsWith(`/${comments.comments[key].id}`) ?
                                    URLSanitize(comments.comments[key]['_urls']['_self']).replace(`/${comments.comments[key].id}`, '') 
                                :
                                    URLSanitize(comments.comments[key]['_urls']['_self']);
                
                            if( url === URLSanitize(metadata.urls.self) ) {
                                needs_metadata = false
                
                            }

                            return needs_metadata
                    
                        }
                    
                    return (
                        comments.comments[key] &&
                        <ListItem
                            icon = { comments.comments[key]._urls?.threads ? <OutlinedCommentsIcon /> : <OutlinedCommentIcon />}
                            key={'li-ticket-comment-' + comments.comments[key].id}
                            style={{
                                marginBottom: 'var(--pf-t--global--spacer--md)',
                            }}
                            isBlock={true}
                        >
                            <>
                            { ! metadata && <Skeleton /> }
                            { metadata && <Comment
                                errorState = {fetcher.data}
                                FormComponent = {fetcher.Form}
                                key={'ticket-comment-' + comments.comments[key].id}
                                objectData = {comments.comments[key]}
                                objectMetadata = {need_metadata() ? null : metadata}
                            />}
                            </>
                        </ListItem>
                    )
                })}

                    <ListItem
                        icon = {
                            <IconLoader
                                name={'reply'}
                                size = "lg"
                            />
                        }
                        isBlock={true}
                        id={'ticket-comment-reply-form'}
                        style={{
                            marginTop: 'var(--pf-t--global--spacer--sm)',
                        }}
                    >
                        <>
                        { ! metadata && <Skeleton /> }
                        { metadata && 
                        <Comment
                            errorState = {fetcher.data}
                            FormComponent = {fetcher.Form}
                            isCreate = {true}
                            objectMetadata={metadata}
                        />}
                        </>
                    </ListItem>


            </List>
        </Flex>
        </>
    );
}



/**
 * @summary Props for Comment component.
 * 
 * @category Props
 * @since 0.9.0
 */
export type CommentProps = {

    /**
     * The form component to use.
     */
    FormComponent: typeof Form,

    /**
     * Is this a comment to be created. Converts the comment output to be a
     * form.
     */
    isCreate?: boolean,

    /**
     * Data from the API. This object is not required when `isCreate = true`
     */
    objectData?: apiObject,

    /**
     * Metadata from the API.
     */
    objectMetadata: APIMetadata,

}


/**
 * 
 * This component is self contained and is only dependant upon the objectData
 * or isCreate.
 * 
 * When no objectMetadata is supplied, will make an initial HTTP/OPTIONS
 * request to fetch the comments metadata. The comment will then be rendered.
 * 
 * Supplying `isCreate = True` will render the comment as a form so that it can
 * be used to create a comment. If the model in question has many different
 * sub-models, supplying the base metadata via the `objectMetadata` param is
 * required so that they can be added as a comment type to create.
 * 
 * 
 * @summary Display a comment (or the like) from a single person.
 * 
 * @category Component
 * @since 0.1.0
 */
export const Comment = ({
    errorState = undefined,
    FormComponent = Form,
    isCreate = false,
    objectData,
    objectMetadata = null,
}: CommentProps): React.JSX.Element => {

    const [ commentMetadata, setCommentMetadata ] = useState( objectMetadata )

    const [ comment_page_data, setCommentPageData ] = useState( objectData )

    const [ commentType, setCommentType ] = useState(null)

    const [ formState, setFormState ] = useState({});

    const [ isEdit, setIsEditing ] = useState(false)

    const [ isExpanded, setIsExpanded ] = useState(! objectData?.closed);

    const [ isOpen, setIsOpen ] = useState(false);

    const [ objectURL, setObjectURL ] = useState(comment_page_data?._urls?._self ? URLSanitize(comment_page_data._urls._self) : null);

    const [ start_thread, setStartThread ] = useState( false )

    const [ subModels, setSubModels ] = useState(() => [
        ...( objectMetadata?.urls?.sub_models ?
            Object.entries(objectMetadata?.urls?.sub_models).map(([key, data]) => {

                return { name: data.display_name, url: data.url};
            })
            :
            []
        ),
        {
            name: "Comment",
            url: objectMetadata?.urls?.self
        }
    ]);


    const user = useContext(UserContext);

    let comment_header = ' wrote'

    let comment_class = 'comment comment-type-default'

    const comment_updated = false

    useEffect(() => {

        if( commentMetadata ) {

            const comment_type = commentMetadata.name

            if( comment_type.toLowerCase().includes('action') ) {

                comment_class += ' comment-type-action'

                setCommentType('action')

            }else if( comment_type.toLowerCase().includes('notification') ) {

                comment_class += ' comment-type-notification'

                setCommentType('notification')

            }else if( comment_type.toLowerCase().includes('task') ) {

                comment_class += ' comment-type-task'

                comment_header = ' created a task'

                setCommentType('task')

            } else if( comment_type.toLowerCase().includes('solution') ) {

                comment_class += ' comment-type-solution'

                comment_header = ' solved'

                setCommentType('solution')

            } else {

                setCommentType('comment')

            }

        }

    }, [
        commentMetadata
    ]);


    const comment_header_text_updated = (<span className="sub-script">Updated </span>)

    const comment_header_text = (
        <>
        {commentMetadata && comment_page_data && !isCreate && !isEdit &&
        <div className="text">
            <FieldData
                metadata={commentMetadata}
                field_name='user'
                data={comment_page_data}
            />
            <span className="sub-script">{comment_header} on </span>
            <FieldData
                metadata={commentMetadata}
                field_name='created'
                data={comment_page_data}
            />
            {comment_updated && <span>{comment_header_text_updated}
                <FieldData
                    metadata={commentMetadata}
                    field_name='modified'
                    data={comment_page_data}
                />
            </span>}

        </div>}
        { (isCreate || isEdit) && commentMetadata &&
            <CardTitle>
                {isCreate && "Add"}
                {isEdit && "Edit"}
                &nbsp;{commentMetadata.name}
            </CardTitle>
        }
        </>
    )


    useEffect(() => {
        setCommentPageData(objectData)
    }, [ objectData ]);

    useEffect(() => {

        if( ! commentMetadata && objectURL ) {

            async function do_fetch() {

                let url = URLSanitize( objectURL )

                if( comment_page_data ) {
                    let url_tail = `/${comment_page_data['id']}`

                    if( url.endsWith( url_tail ) ) {    // Remove the object id from end of URL

                        url = url.substr(0, url.length - url_tail.length)
                    }
                }


                await apiFetch(
                    url,
                    null,
                    'OPTIONS'
                )
                    .then((result) => {

                        if( result.status === 200 ) {

                            if( result.api_metadata !== null ) {

                                setCommentMetadata(result.api_metadata)
            
                            }
                        }
                    })
            }

            do_fetch()

        };

    }, [
        commentMetadata,
    ])



    const onSelect = () => {
        setIsOpen(!isOpen);
    };

    const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
        setIsExpanded(isExpanded);
    };


    if( commentType === 'action' ) {

        return(
            commentMetadata && comment_page_data && commentType &&
            <div id={'comment-' + comment_page_data['id']} key={'comment-' + comment_page_data['id']}>
                <span style={{display: 'inline-block'}}>
                    <FieldData
                        metadata={commentMetadata}
                        field_name='user'
                        data={comment_page_data}
                    />
                </span>&nbsp;
                <span className="markdown" style={{display: 'inline-block'}}>
                    <FieldData
                        metadata={commentMetadata}
                        field_name='body'
                        data={comment_page_data}
                    />
                </span>&nbsp;
                <span className="sub-script" style={{color: '#777', display: 'inline-block'}}>
                    <FieldData
                        metadata={commentMetadata}
                        field_name='created'
                        data={comment_page_data}
                    />
                </span>
            </div>
        )
    }

    const header_icons = (
        comment_page_data &&
        <div id={'comment-icons-' + comment_page_data['id']} className="icons">
            {comment_page_data['parent'] == null &&
            <Button
                aria-label = "reply to comment"
                icon = {
                    <IconLoader
                        name={'reply'}
                        size = "lg"
                    />
                }
                onClick={() => setStartThread( (start_thread ? false : true) ) }
                variant="plain"
            />
            }
        </div>
    )


    const dropdownItems = (
        <>
            { isCreate && objectMetadata?.urls?.sub_models &&
                <>
                {subModels.map(({name, url}) => {

                    return (
                        <DropdownItem
                            key={name}
                            onClick={() => {

                                setObjectURL(url)
                                setCommentMetadata(null)
                            }}
                        >
                            Create {name}
                        </DropdownItem>
                    );
                })}
                
                <DropdownItem
                    key = "clear-form"
                    onClick={() => {

                        setFormState({})
                    }}
                >
                    Reset Fields
                </DropdownItem>
                </>
            }
            {!isCreate &&
            <>
            { ! isEdit && <DropdownItem
                key="Edit"
                onClick={(e) => {
                    setIsEditing( true )
                }}
            >
                Edit
            </DropdownItem>}
            <DropdownItem key="copy-link" >
                Copy Link
            </DropdownItem>
            </>}
        </>
    );

    const headerActions = (
        <>
            {! isCreate && ! isEdit && header_icons}
            <Dropdown
                onSelect={onSelect}
                toggle={
                    toggleRef => (
                        <MenuToggle
                            ref={toggleRef}
                            isExpanded={isOpen}
                            onClick={() => setIsOpen(!isOpen)}
                            variant="plain"
                            aria-label="Card title inline with images and actions example kebab toggle"
                            icon={<EllipsisVIcon />}
                        />
                    )
                }
                isOpen={isOpen}
                onOpenChange={isOpen => setIsOpen(isOpen)}
            >
                <DropdownList>
                    {dropdownItems}
                </DropdownList>
            </Dropdown>
        </>
    );


    const CommentCard = (
        <>
        { commentMetadata && ((!isCreate && comment_page_data) || isCreate) &&
        <Card
            isCompact
            // isLarge
        >
            
            <CardHeader
                actions={{ actions: headerActions, hasNoOffset: true}}
            >
                {comment_header_text}
            </CardHeader>

            <CardBody>

                <Flex
                    direction={{ default: 'column' }}
                >
                    <Flex
                        direction={{ default: 'row' }}
                    >

                        <Fields
                            errorState={errorState}
                            fields={[
                                (( (isCreate || isEdit) && commentMetadata.fields.source) || ( (!isEdit && !isCreate) && comment_page_data.source)) && 'source',
                                (( (isCreate || isEdit) && commentMetadata.fields.status) || ( (!isEdit && !isCreate) && comment_page_data.status)) && 'status',
                                (( (isCreate || isEdit) && commentMetadata.fields.assignee) || ( (!isEdit && !isCreate) && comment_page_data.assignee)) && 'assignee',
                                (( (isCreate || isEdit) && commentMetadata.fields.category) || ( (!isEdit && !isCreate) && comment_page_data.category)) && 'category'
                            ].filter(Boolean)}
                            formState={formState}
                            isCreate={isCreate}
                            isEdit={isEdit}
                            isFlex = {true}
                            objectData={comment_page_data}
                            objectMetadata={commentMetadata}
                            onChange={setFormState}
                        />
        
                    </Flex>
                    <Flex
                        direction={{ default: 'column' }}
                    >
                        <Divider />

                        <Fields
                            errorState={errorState}
                            fields={[
                                'body'
                            ]}
                            formState={formState}
                            isCreate={isCreate}
                            isEdit={isEdit}
                            isFlex = {true}
                            objectData={comment_page_data}
                            objectMetadata={commentMetadata}
                            onChange={setFormState}
                        />

                        <Divider />
                    </Flex>
                    <Flex
                        direction={{ default: 'row' }}
                    >

                        <Fields
                            errorState={errorState}
                            fields={[
                                (( (isCreate || isEdit) && commentMetadata.fields.planned_start_date) || ( (!isEdit && !isCreate) && comment_page_data.planned_start_date)) && 'planned_start_date',
                                (( (isCreate || isEdit) && commentMetadata.fields.planned_finish_date) || ( (!isEdit && !isCreate) && comment_page_data.planned_finish_date)) && 'planned_finish_date',
                                (( (isCreate || isEdit) && commentMetadata.fields.real_start_date) || ( (!isEdit && !isCreate) && comment_page_data.real_start_date)) && 'real_start_date',
                                (( (isCreate || isEdit) && commentMetadata.fields.real_finish_date) || ( (!isEdit && !isCreate) && comment_page_data.real_finish_date)) && 'real_finish_date',
                                // secondsToTime(comment_page_data['duration'])
                                ( (!isEdit && !isCreate) && comment_page_data.duration) && 'duration',
                                ( (!isEdit && !isCreate) && comment_page_data.estimation) && 'estimation'
                            ].filter(Boolean)}
                            formState={formState}
                            isCreate={isCreate}
                            isEdit={isEdit}
                            isFlex = {true}
                            objectData={comment_page_data}
                            objectMetadata={commentMetadata}
                            onChange={setFormState}
                        />

                    </Flex>
                </Flex>
            </CardBody>
            <CardFooter>
                { (isCreate || isEdit) &&
                <>
                { isEdit &&
                <Button
                    variant="secondary"
                    onClick={(response) => {

                        setIsEditing(false);

                    }}
                >
                    Cancel
                </Button>
                }
                <Button
                    type="submit"
                    variant="primary"
                >
                    Save
                </Button>
                </>
                }
            </CardFooter>
        </Card>
        }
        </>
    );


    return (
        (commentMetadata && ((!isCreate && comment_page_data) || isCreate) && commentType) &&
        <>
        <Flex
            direction={{ default: 'column' }}
        >
            <FlexItem>
                {( isCreate || isEdit ) &&
                    <FormComponent
                        action={isCreate ? URLSanitize(commentMetadata['urls']['self']) : URLSanitize(comment_page_data['_urls']['_self']) }
                        className = "pf-v6-c-form pf-m-vertical"
                        method={isCreate ? "POST" : "PATCH"}
                        navigate={false}
                        onSubmit={() => {
                                setIsEditing(false)
                        }}
                    >
                        {CommentCard}

                        <input id="metadata" type="hidden" name="metadata" value={JSON.stringify(commentMetadata)} />
                        <input id="tz" type="hidden" name="tz" value={user.settings.timezone} />

                    </FormComponent>
                }
                {!( isCreate || isEdit ) &&

                    CommentCard

                }
            </FlexItem>

            { (comment_page_data?._urls?.threads || start_thread ) &&
            <ExpandableSection
                isExpanded = { isExpanded }
                onToggle={onToggle}
                style={{
                    borderBottom: "1px groove var(--pf-t--global--border--color--subtle",
                    borderLeft: "1px groove var(--pf-t--global--border--color--subtle)",
                    margin: "0",
                    marginBottom: "var(--pf-t--global--spacer--sm)",
                    marginTop: "calc( var(--pf-t--global--spacer--sm) * -1)",
                    paddingBottom: "var(--pf-t--global--spacer--md)",
                    paddingLeft: "var(--pf-t--global--spacer--md)"
                }}
                toggleContent = {
                    <Title headingLevel="h3">Replies</Title>
                }
            >
            <FlexItem>
                <Comments
                    comments_url = {
                        start_thread ?
                            `${URLSanitize(comment_page_data._urls._self)}/threads`
                        :
                            URLSanitize(comment_page_data._urls.threads)}
                />
            </FlexItem>
            </ExpandableSection>
            }

        </Flex>
        </>
    );
}
