import {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState
} from "react";

import {
    Form,
    Link,
    useActionData,
    useLocation,
} from "react-router";

import {
    ActionGroup,
    Alert,
    AlertGroup,
    Button,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Divider,
    Flex,
    FlexItem,
    List,
    ListItem,
} from "@patternfly/react-core";

import { PencilAltIcon } from '@patternfly/react-icons';

import { apiFetch } from "../hooks/apiFetch";
import FieldData from "../functions/FieldData";
import FormField from "./FormField";
import { FormatTime } from "../functions/FormatTime";
import { useIsMobile } from "../hooks/useIsMobile";
import UserContext from "../hooks/UserContext";
import URLSanitize from "../functions/URLSanitize";
import { apiObject } from "../types/backend/apiObject/object";
import { layoutDataset } from "../types/backend/apiMetadata/layout/dataset";
import { layoutDetail } from "../types/backend/apiMetadata/layout/detail";
import { layoutTable } from "../types/backend/apiMetadata/layout/table";


/**
 * @summary Props for Fields Component
 * 
 * @category Type
 * @since 0.9.0
 */
export type FieldsProps = {

    /**
     * Form errors.
     */
    errorState: object

    /**
     * Form fields to fetch.
     */
    fields: Array<string>

    /**
     * Form to to use if creating / editing.
     * 
     * If required, this will normally come from a fetcher.
     */
    formComponent: typeof Form

    /**
     * Current form edit state.
     */
    formState: object

    /**
     * Is the object being created.
     */
    isCreate?: boolean

    /**
     * It the object being edited.
     */
    isEdit?: boolean

    /**
     * Display form as flex.
     */
    isFlex?: boolean

    /**
     * Object Data.
     */
    objectData: apiObject

    /**
     * Object Metadata
     */
    objectMetadata: APIMetadata

    /**
     * Callback when the form changes.
     */
    onChange: Dispatch<SetStateAction<object>>

    /**
     * After each form field, add a divider.
     */
    useDivider?: boolean
}


/** 
 * 
 * @summary Fetch and display fields.
 * 
 * @category Component
 * @since 0.9.0
 */
export const Fields = ({
    errorState,
    fields,
    formComponent,
    formState,
    isCreate = false,
    isEdit = false,
    isFlex = false,
    objectData,
    objectMetadata,
    onChange,
    useDivider = false
}: FieldsProps): React.JSX.Element => {

    const [isFieldEdit, setIsFieldEdit] = useState({});

    let textarea_fields = [
        'json',
        'markdown'
    ];

    return fields.map((field) => {

        if(
            String(objectMetadata.fields[field]?.type).toLowerCase() == 'markdown'
            && field !== 'model_notes'
            && textarea_fields.includes(String(objectMetadata.fields[field]?.type).toLowerCase())
            && ! isEdit
            && ! isFlex
        ) {

            return(
                    <FieldData
                        data={objectData}
                        field_name={field}
                        full_width = {true}
                        key = { `field-${field}` }
                        metadata={objectMetadata}
                    />
            );

        } else if( isFlex ) {

            if( isEdit || isCreate ) {

                return (
                    <FormField
                        errorState={errorState}
                        fieldName = {field}
                        FormComponent = {formComponent}
                        formState = {formState}
                        isCreate = {isCreate}
                        isEdit = {isEdit}
                        key = { `field-${field}` }
                        objectData = {objectData}
                        objectMetadata = {objectMetadata}
                    >
                        { useDivider && <Divider />}
                    </FormField>
                );
                
            } else {

                return (
                    <FlexItem
                        direction={{ default: 'column' }}
                        key = { `field-${field}` }
                    >
                        <label
                            style={{
                                display: "block",
                                fontWeight: "var(--pf-t--global--font--weight--200)"
                            }}
                        >{objectMetadata.fields[field]?.label}</label>
                        <div>
                            <FieldData
                                metadata={objectMetadata}
                                field_name={field}
                                data={objectData}
                            />
                        </div>
                        { useDivider && <Divider />}
                    </FlexItem>
                );

            }

        } else {

            if( ! isEdit && ! isCreate && ! isFieldEdit?.[field]) {

                return(
                    <DescriptionListGroup
                        key = { `field-${field}` }
                    >
                        <DescriptionListTerm>
                            {objectMetadata.fields[field]?.label}
                            { ! Boolean(objectMetadata.fields[String(field).endsWith('_badge') ? String(field).replace('_badge', '') : field]?.read_only) &&
                            <Button
                                aria-label="Action"
                                icon={<PencilAltIcon />}
                                variant="plain"
                                onClick={(_event) => {
                                    setIsFieldEdit({[field]: true})
                                }}
                            />}
                        </DescriptionListTerm>
                        <DescriptionListDescription>
                            <FieldData
                                metadata={objectMetadata}
                                field_name={field}
                                data={objectData}
                            />
                        </DescriptionListDescription>
                        { useDivider && <Divider />}
                    </DescriptionListGroup>
                );

            }

            /**
             * 
             * 
             * Pure Form Group
             * 
             */

            if(field in objectMetadata.fields ) {
                return (
                    <FormField
                        errorState={errorState}
                        fieldName = {field}
                        formState = {formState}
                        isCreate = {isCreate}
                        isEdit = {isFieldEdit?.[field] ? isFieldEdit[field] : isEdit}
                        isInlineEdit = {isFieldEdit?.[field] ? true : false}
                        inlineEditCancel = {() => {
                            setIsFieldEdit({[field]: false})
                            onChange({})
                        }}
                        key = { `field-${field}` }
                        objectData = {objectData}
                        objectMetadata = {objectMetadata}
                    />
                );
            } else {
                return;
            }
        }
    })
}



// eslint-disable-next-line
const Column = ({isEdit, isMobile, children}) => {


    if( isEdit ) {

        return (
            <Flex
                direction = {{ default: "column"}}
            >
                {children}
            </Flex>
        );

    } else {

        return (
            <DescriptionList
                columnModifier={{
                    default: '1Col'
                }}
                aria-label="Model fields"
                isCompact = {true}
                isFillColumns = {true}
            >

                {children}

            </DescriptionList>
        );
    }
}



/**
 * @summary Props for DisplayFields Component
 * 
 * @category Props
 * @since 0.9.0
 */
export type DisplayFieldsProps = {

    /**
     * Data for the object.
     */
    existingFormData?: object | null

    /**
     * Form component to use
     */
    FormComponent?: typeof Form

    /**
     * Set fields to create mode.
     */
    isCreate?: boolean

    /**
     * Page Layout information.
     */
    layout: layoutDataset | layoutDetail | layoutTable

    /**
     * API Metadata for the object.
     */
    metadata: APIMetadata

    /**
     * On close callback
     */
    onClose: ( val: boolean ) => void,
}



/** Display Fields
 * 
 * Create the layout for the specified fields.
 * 
 * todo there needs to be a way to specify if its just going to be markdown/json
 * field data, or if its going to be a description list group.
 * 
 * @category Component
 * @since 0.9.0
 */
const DisplayFields = ({
    existingFormData = null,
    FormComponent = Form,
    isCreate = false,
    layout = null,
    metadata,
    onClose = null,
}: DisplayFieldsProps): React.JSX.Element => {

    const actionData = useActionData();

    const [ data, setformData ] = useState(existingFormData);

    const [ pageMetadata, setPageMetadata ] = useState(metadata);

    const [ formState, setFormState ] = useState({});

    const isMobile = useIsMobile();

    const location = useLocation();

    const [ isEdit, setIsEdit ] = useState(true);

    const [ isLoading, setIsLoading ] = useState(true);

    const user = useContext(UserContext);

    const handleOnClose = (_event) => {

        if( _event === true ) {
            if( onClose ) {
                onClose(true);
            }
        }
    };

    useEffect(() => {
        setformData(existingFormData)
        setPageMetadata(metadata)
    }, [existingFormData]);


    useEffect(() => {

        if(actionData?.body && actionData?.ok) {

            setformData(actionData?.body);

            if( isCreate && isLoading ) {

                delete actionData.body;
                delete actionData.errors;
                delete actionData.ok;

                if( onClose ) {
                    onClose(true)
                }

            }

        }
    }, [actionData])


    useEffect(() => {

        setIsEdit(() => {
            if(
                actionData?.errors
                ||
                String(location.pathname).endsWith('/add')
                ||
                isCreate
            ) {
                return true;
            }

            return false;
        })

    }, [actionData, location.pathname])


    let cardData;

    if( layout.layout === 'double' && ! isCreate ) {

        cardData = (
            <>
            <Flex
                flexWrap={{ default: 'wrap'}}
                gap={{ default: 'gap'}}
            >
                <FlexItem
                    grow={{ default: 'grow'}}
                    flex = {{
                        default: "flexDefault",
                        lg: 'flex_1' 
                    }}
                >
                    <Column
                        isEdit = {isEdit}
                        isMobile={isMobile}
                    >
                        <Fields
                            errorState={actionData}
                            fields={layout.left}
                            formState={formState}
                            isCreate={isCreate}
                            isEdit={isEdit}
                            objectData={data}
                            objectMetadata={pageMetadata}
                            onChange={setFormState}
                        />
                    </Column>
                </FlexItem>

                 <FlexItem
                    grow={{ default: 'grow'}}
                    flex = {{
                        default: "flexDefault",
                        lg: 'flex_1' 
                    }}
                 >
                    <Column
                        isEdit = {isEdit}
                        isMobile={isMobile}
                    >
                        <Fields
                            errorState={actionData}
                            fields={layout.right}
                            formState={formState}
                            isCreate={isCreate}
                            isEdit={isEdit}
                            objectData={data}
                            objectMetadata={pageMetadata}
                            onChange={setFormState}
                        />
                    </Column>
                </FlexItem>
            </Flex>
            </>
        );

    } else if( layout.layout === 'single' || isCreate ) {

        let columnFields = layout.fields

        if( isCreate) {
            columnFields = Object.entries(pageMetadata.fields).map(([fieldName, meta]) => {
                return fieldName;
            });
        }

        cardData = (
            <Column
                isEdit = {isEdit}
                isMobile={isMobile}
            >
                <Fields
                    errorState={actionData}
                    fields={columnFields}
                    formState={formState}
                    isCreate={isCreate}
                    isEdit={isEdit}
                    objectData={data}
                    objectMetadata={pageMetadata}
                    onChange={setFormState}
                />
            </Column>
        );

    }

    const actionGroup = (

            <ActionGroup
                style={
                    isEdit ?
                        undefined
                    :
                    { paddingTop: "var(--pf-t--global--spacer--2xl)" }
                }
            >
                {isEdit &&
                    <Button
                        type="submit"
                        variant="primary"
                    >
                        Save
                    </Button>
                }

                <Button
                    variant={!isEdit ? "primary" : "secondary"}
                    onClick={(_event) => {
                        setIsEdit(_event.target.textContent === 'Cancel' ? false : true)

                        if( _event.target.textContent == 'Cancel' ) {

                            setFormState({})
                            handleOnClose(true)

                        }

                        if( String(location.pathname).endsWith('/add') ) {

                        }

                    }}
                    component={String(location.pathname).endsWith('/add') ? (props) => <Link {...props} to={String(location.pathname).replace('/add', '')}/>:undefined}
                >
                    {isEdit ? "Cancel" : "Edit"}
                </Button>
            </ActionGroup>
    )

    if( isEdit ) {

        cardData = (
            <FormComponent
                action = {
                    (String(location.pathname).endsWith('/add') || isCreate)
                    ?
                        pageMetadata.urls.new
                        ?
                            URLSanitize(pageMetadata.urls.new)
                        :
                            URLSanitize(pageMetadata.urls.self)
                    :
                        URLSanitize(pageMetadata.urls.self)
                }
                className = "pf-v6-c-form"
                id="random"
                method={(String(location.pathname).endsWith('/add') || isCreate) ? "POST" : "PATCH"}
                onSubmit={(_event) => {
                    setIsLoading(true)
                }}
                navigate = {false}
            >
                {actionData?.errors &&
                <AlertGroup>
                    <Alert
                        variant="danger"
                        isInline
                        title="The following field(s) have errors:"
                        timeout={false}
                    >
                        <List>
                        {Object.entries(actionData.errors).map(([fieldKey, fieldErrors]) => {

                            return (<ListItem>{pageMetadata.fields[fieldKey].label}</ListItem>);

                        })}
                        </List>
                    </Alert>
                </AlertGroup>
                }

                {cardData}
                {actionGroup}

                <input id="formState" type="hidden" name="formState" value={JSON.stringify(formState)} />
                <input id="metadata" type="hidden" name="metadata" value={JSON.stringify(pageMetadata)} />
                <input id="tz" type="hidden" name="tz" value={user.settings.timezone} />

            </FormComponent>
        );

    }


    return (
        <>
            {cardData}

            { !isEdit &&
                actionGroup
            }
        </>
    );

}



export default DisplayFields;


/**
 * @summary Props for APISubmitAction Loader.
 * 
 * @category Props
 * @expand
 * @since 0.9.0
 */
export type APISubmitActionProps = {

    /**
     * HTTP request object provided by React Router containing the submitted
     * `FormData`.
     */
    request: object
}



/**
 * 
 * React Router route `action` handler used to submit form data to a backend
 * endpoint (typically a Django REST Framework API). The function processes
 * submitted `FormData`, extracts the serialized `formState`, and constructs
 * a payload object suitable for API submission.
 *
 * This action expects the form submission to include a field named
 * `formState` containing a JSON serialized object representing the
 * client-side form state.
 *
 * The action also reads other standard form fields such as `tz`
 * (timezone) and merges them with the parsed `formState`.
 *
 * @summary Form Submit Action
 *
 * @throws Error
 * Throws if the `formState` field is missing or cannot be parsed as JSON.
 *
 * @example
 * Form submission must include a serialized form state:
 *
 * ``` html
 * 
 * <Form method={method}>
 *   <input type="hidden" name="formState" value={JSON.stringify(formState)} />
 *   <input type="hidden" name="metadata" value={JSON.stringify(metadata)} />
 *   <input type="hidden" name="tz" value={timezone} />
 * </Form>
 *
 * ```
 * 
 * @example
 * Basic usage inside a React Router route definition:
 *
 * ``` js
 * 
 * {
 *   path: "/:module/:id",
 *   action: APISubmitAction
 * }
 * 
 * ```
 * 
 * @category Loader
 * @since 0.9.0
 */
export async function APISubmitAction({
    request
}: APISubmitActionProps): Promise<Response|Object|null> {


    console.debug(request);    // Trace

    const data = await request.formData();

    const formFields = Object.fromEntries(data.entries());

    const metadata = JSON.parse(formFields.metadata);

    if( ! formFields.metadata ) {

        throw new Error('metadata field must be provided in the submitted form');

    }


    if( ! formFields.tz ) {

        throw new Error('metadata field must be provided in the submitted form');

    }


    let form_data = {}

    for (const [fieldName, fieldValue] of Object.entries(formFields)) {

        if( ! metadata.fields.hasOwnProperty(fieldName) ) {    // field not part of request

            continue;

        }


        let value = '';

        switch( String(metadata.fields[fieldName].type).toLowerCase() ) {


            case 'datetime':    // Convert to the users timezone

                value = FormatTime({
                    time: String(fieldValue),
                    iso: true,
                    tz: formFields.tz
                });

                break;

            default:

                value = fieldValue;

                break;

        }

        if( value !== '' && value !== 0 ){

            form_data = {
                ...form_data,
                [fieldName]: value
            }

        }


    }


    let actionReturn = {
        // errors: {},    // Don't include this key by default. its existance denotes an error has occured.
        ok: false,
        body: null,
        method: request.method
    }

    const update = await apiFetch(
        URLSanitize(request.url),
        null,
        request.method,
        form_data,
        false,
        false
    )
        .then(async (response) => {

            actionReturn.ok = response.ok;

            if( response.ok ) {

                actionReturn.body = await response.clone().json();

            } else {

                actionReturn.errors = await response.clone().json();

            }


            actionReturn.status_code = response.status

            return response;

        });


    console.debug(update);    // Trace

    console.debug(actionReturn);    // Trace
    
    return actionReturn;

}
