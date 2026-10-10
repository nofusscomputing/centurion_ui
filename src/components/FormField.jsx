import {
    useContext,
    useRef,
    useState,
} from "react";

import {
    Form
} from "react-router";

import {
    Alert,
    Button,
    FormGroup,
    FormGroupLabelHelp,
    FormHelperText,
    FormSelect,
    FormSelectOption,
    HelperText,
    HelperTextItem,
    Popover,
    Switch,
    TextArea,
    TextInput
} from "@patternfly/react-core";

import {
    TimesIcon,
    CheckIcon
} from '@patternfly/react-icons';

import FieldData from "../functions/FieldData";
import DualFieldSelector from "./form/DualFieldSelector";
import MarkdownEditor from "./MarkdownEditor";
import UserContext from "../hooks/UserContext";

import '@patternfly/react-styles/css/components/Form/form.css'
import '@patternfly/react-styles/css/components/FormControl/form-control'
import '@patternfly/react-styles/css/components/HelperText/helper-text.css'
import '@patternfly/react-styles/css/components/Popover/popover.css'
import '@patternfly/react-styles/css/components/Switch/switch.css'
import '@patternfly/react-styles/css/components/TextInputGroup/text-input-group.css'


/** Display a Form Field
 * 
 * ## Form State
 * 
 * Form State is maintained by this component. each edit to a form field will
 * update the form state with just what was edited and any required fields.
 * 
 * The form state object will be in the format ready to be used as the JSON
 * body that the API requires.
 * 
 * @param param
 * 
 * @param {array<Object>} param.errorState Any found errors.
 * @param {string} param.fieldName name of the field. This is the name of the key within the API object.
 * @param {React.JSX.Element} param.FormComponent the form component to use
 * @param {object} param.formState State of any edits within the form.
 * @param {function} param.inlineEditCancel Callback to run when inline edit cancel is pressed.
 * @param {boolean} param.isCreate Is new field data being added
 * @param {boolean} param.isEdit Is the field being edited.
 * @param {boolean} param.isInlineEdit Is the field being edited inline.
 * @param {object} param.objectData object as received from API.
 * @param {object} param.objectMetadata object metadata as received from API.
 * 
 * @returns Desired Form Field as a ready to place component.
 */
const FormField = ({
    errorState,
    fieldName,
    FormComponent = Form,
    formState,
    inlineEditCancel,
    isEdit = false,
    isCreate = false,
    isInlineEdit = false,
    objectData,
    objectMetadata,
}) => {

    if( String(fieldName).endsWith('_badge') && isEdit) {
        fieldName = String(fieldName).replace('_badge', '')
    }

    const [ fieldState, setFieldState ] = useState(null);


    let dataFieldType = objectMetadata.fields[fieldName].type;

    switch(objectMetadata.fields[fieldName].relationship_type) {

        case "ManyToMany":

            dataFieldType = objectMetadata.fields[fieldName].relationship_type

            break;
    }


    const readOnly = Boolean(objectMetadata.fields[fieldName].read_only)

    const fieldData = Object.hasOwn(formState, fieldName)
        ? formState[fieldName]
        : isCreate
            ? (objectMetadata.fields[fieldName].initial ?? '')
            : (FieldData({
                metadata: objectMetadata,
                field_name: fieldName,
                data: objectData,
                withFormatting: (
                    (dataFieldType === 'DateTime' && readOnly) ?
                        true
                    :
                        false
                )
            }) ?? '');


    const labelHelpRef = useRef(null);

    const isRequired = Boolean(objectMetadata.fields[fieldName].required);

    const writeOnly = Boolean(objectMetadata.fields[fieldName].write_only);

    const user = useContext(UserContext);

    if(
        (isCreate && ((readOnly && !writeOnly) ))
        || (isEdit && readOnly)
    ) { // Don't show a read-only field.
        return;
    }


    if( !formState ) {

        throw Error("field formState is required to render a form field.")

    }


    const handleFieldChange = (_event, field) => {

        let field_value = _event.target.value;

        if( _event.target.type === 'select-one' ) {

            field_value = Number(field_value);

        } else if( _event.target.type === 'select-multiple' ) {

            let select_val = Array();

            for( const option of _event.target ) {

                if( option.selected ) {

                    select_val.push(Number(option.value));

                }
            }

            field_value = select_val;
        }

        setFieldState(field_value)

    }


    const fetchFormField = () => {

        switch( dataFieldType ) {

            case 'Boolean':

                return (
                    <Switch
                        aria-label = {fieldName}
                        id="simple-switch"
                        key = {fieldName}
                        name = {fieldName}
                        defaultChecked={fieldData}
                        ouiaId="BasicSwitch"
                    />
                );

            case 'Choice':
            case 'Relationship':

                let selectedOption = '';

                const selectOptions = Object.entries(objectMetadata.fields[fieldName].choices).map(([key, choice]) => {

                        const options = { "component": [] }

                        if(
                            (
                                ( typeof(choice.value) === 'number' && Number(fieldData) == choice.value )
                                    ||
                                ( typeof(choice.value) === 'string' && String(fieldData) == choice.value )
                            )
                                &&
                            fieldState === null
                        ) {

                            selectedOption = choice.value;
                            setFieldState(choice.value)

                        }


                        return (
                            <FormSelectOption
                                isDisabled={false}
                                key={key}
                                value={choice.value}
                                label={choice.display_name}
                            />
                        );
                    })

                return (
                    <FormSelect
                        aria-label="FormSelect Input"
                        key = {fieldName}
                        name = {fieldName}
                        onChange={handleFieldChange}
                        ouiaId="BasicFormSelect"
                        value = {fieldState}
                    >
                        <FormSelectOption isDisabled={false} key="empty" value={null} label={''} />
                        {selectOptions}

                    </FormSelect>
                );

            case 'Date':
            case 'DateTime':
            case 'Email':
            case 'GenericField':    // 'UUID':    // todo: fix centurion field type
            case 'Integer':
            case 'String':

                let inputFieldType = "text";

                if( dataFieldType === 'Date' ) {

                    if( !readOnly ) {
                        inputFieldType = "date"
                    }
                } else if( dataFieldType === 'DateTime' ) {

                    if( !readOnly ) {
                        inputFieldType = "datetime-local"
                    }
                } else if( dataFieldType === 'Email' ) {

                    if( !readOnly ) {
                        inputFieldType = "email"
                    }
                } else if( dataFieldType === 'Integer' ) {

                    if( !readOnly ) {
                        inputFieldType = "number"
                    }
                }


                return (
                    <TextInput
                        aria-describedby = "simple-form-name-01-helper"
                        isRequired = {isRequired ? null : undefined}
                        id = {fieldName}
                        key = {fieldName}
                        name = {fieldName}
                        readOnly = {readOnly ? null : undefined}
                        type = {inputFieldType}
                        defaultValue = {fieldData}
                    />
                );

            case 'JSON':

                return (
                    <TextArea
                        aria-label = "text area example"
                        isRequired = {isRequired ? null : undefined}
                        id = {fieldName}
                        key = {fieldName}
                        name = {fieldName}
                        readOnly = {readOnly ? null : undefined}
                        resizeOrientation = "vertical"
                        defaultValue = {fieldData}
                    />
                );

            case 'Markdown':

            let markdownFieldData = fieldData

                if( fieldData?.render ) {
                    markdownFieldData = markdownFieldData.markdown;
                }

                return (
                    <MarkdownEditor
                        ariaLabel = "text area example"
                        grow = {true}
                        isRequired = {isRequired ? null : undefined}
                        id = {fieldName}
                        objectData = {objectData}
                        name = {fieldName}
                        readOnly = {readOnly ? null : undefined}
                        resizeOrientation = "vertical"
                        value = {markdownFieldData}
                    />
                );

            case "ManyToMany":

                return (
                    <DualFieldSelector
                        name = {fieldName}
                        isCreate = {isCreate}
                        isEdit = {isEdit}
                        pageData = {objectData}
                        pageMetadata = {objectMetadata}
                    />
                );


            default:

            if( isCreate || isEdit) {
                console.warn(`Unable to return the form field for ${fieldName} as field type ${dataFieldType} does not exist.`)
            }

                if( fieldData?.render ) {
                    return fieldData;
                }
        }
    }


    const formGroup = (
        <FormGroup
            label = {objectMetadata.fields[fieldName].label}
            labelHelp = {
                <Popover
                    triggerRef = {labelHelpRef}
                    bodyContent = {objectMetadata.fields[fieldName].help_text}
                >
                        <FormGroupLabelHelp ref = {labelHelpRef} aria-label = "More info for name field" />
                        
                </Popover>
            }
            isRequired = {isRequired}
            fieldId = "simple-form-name-01"
        >

            {fetchFormField()}
            { ! readOnly && isInlineEdit &&
            <>
                <Button
                    aria-label="Save"
                    icon={<CheckIcon />}
                    type="submit"
                    variant="plain"
                />
                <Button
                    aria-label="Cancel"
                    icon={<TimesIcon />}
                    variant="plain"
                    onClick={inlineEditCancel}
                />
            </>
            }
            <FormHelperText>
            <HelperText>
                <HelperTextItem>
                    {errorState?.errors?.[fieldName] && 

                        errorState.errors[fieldName].map(( errorText ) => {
                        
                            return (
                                <Alert variant = "danger" isInline isPlain title = {errorText.message} />
                            );
                        })
                    }
                </HelperTextItem>
            </HelperText>
            </FormHelperText>
        </FormGroup>
    );

    return (
        <>
        { isInlineEdit &&
            <>
            <FormComponent
                action = {String(document.location.href).replace(document.location.origin, '')}
                className = "pf-v6-c-form"
                id={'edit-' + fieldName} method="PATCH"
                navigate = {false}
                onSubmit={(e) => {
                    
                    if( isInlineEdit ) {
                        
                        inlineEditCancel();

                    }
                }}
            >
                {formGroup}

                <input id="formState" type="hidden" name="formState" value={JSON.stringify(formState)} />
                <input id="metadata" type="hidden" name="metadata" value={JSON.stringify(objectMetadata)} />
                <input id="tz" type="hidden" name="tz" value={user.settings.timezone} />
            </FormComponent>
            </>
        }
        { ! isInlineEdit && formGroup }
        </>
    );


}

export default FormField;
