import { WarningModal } from "@patternfly/react-component-groups";
import { Button, ButtonVariant, Spinner } from "@patternfly/react-core";
import React, { useState } from "react";
import { apiFetch } from "../hooks/apiFetch";
import { apiObject } from "../types/backend/apiObject/object";


const sleep = ms => new Promise(r => setTimeout(r, ms))

/** Delete the object.
 * 
 * Performs a HTTP/DELETE on the provided URL.
 * 
 * @category Function
 * @since 0.9.0
 */
const ActionDeleteRow = async (
    /**
     * URL of the object
     */
    deleteURL: string
): Promise<boolean> => {

    const action = await apiFetch(
        deleteURL,
        null,
        "DELETE",
        null,
        false,
        false
    )
        .then((response) => {

            if( response.status === 204) {

                return true
            }
        })


    return action;
}



/**
 * props for ActionDialog Component.
 * 
 * @category Type
 * @expand
 * @since 0.9.0
 */
export type ActionDialogProps = {

    /**
     * Type of action.
     * 
     */
    actionType?: 'delete',

    /**
     * Data from the API.
     */
    objectData: apiObject

    /**
     * Metadata from the API.
     */
    objectMetadata: APIMetadata

    /**
     * Callback to run on update.
     */
    updateCallback:(success: boolean, id: number) => void
}



/** Action Dialog Box
 * 
 * A self contained action dialog box that performs certain actions,
 * i.e. delete a row.
 * 
 * @category Component
 * @since 0.9.0
 */
const ActionDialog = ({
    actionType = 'delete',
    objectData,
    objectMetadata,
    updateCallback,
}: ActionDialogProps): React.JSX.Element => {

    const [isOpen, setIsOpen] = useState(false);

    const [ isLoading, setIsLoading ] = useState(false)



    const onConfirm = async () => {

        setIsLoading(true)

        let action = false;

        switch(actionType) {

            case 'delete':

                action = await ActionDeleteRow(
                    objectData._urls._self
                );

                break;

            default:
                throw Error('Unknown action requested');
        }

        setIsLoading(false)

        setIsOpen(false)

        updateCallback(action, objectData.id)

    }


    const onClose = () => {

        setIsLoading(false)

        setIsOpen(false)
    }


    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                Delete
            </Button>
            <WarningModal
                checkboxLabel = "Are you sure?"
                confirmButtonVariant = {ButtonVariant.danger}
                isOpen = {isOpen}
                title = "Confirm Delete"
                onClose = {onClose}
                onConfirm = {onConfirm}
                onEscapePress = {onClose}
                withCheckbox = {isLoading ? false : true}
            >
                {!isLoading && <>You are about to delete {objectMetadata.name} with id {objectData.id}. do you wish to continue?</>}
                {isLoading && <Spinner aria-label="Processing" /> }
            </WarningModal>
        </>
    );
}

export default ActionDialog;
