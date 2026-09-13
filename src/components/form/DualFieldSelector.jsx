import {
    useMemo,
    useState
} from 'react';

import {
    DualListSelector,
    DualListSelectorPane,
    DualListSelectorList,
    DualListSelectorListItem,
    DualListSelectorControlsWrapper,
    DualListSelectorControl
} from '@patternfly/react-core';

import { AngleDoubleLeftIcon } from '@patternfly/react-icons';
import { AngleDoubleRightIcon } from '@patternfly/react-icons';
import { AngleLeftIcon } from '@patternfly/react-icons';
import { AngleRightIcon } from '@patternfly/react-icons';


/** Helper Function to build event object */
const eventConstructor = (fieldName, value) => {

    let valueType = String(typeof(value)).toLowerCase()

    return {
        target: {
            name: fieldName,
            type: valueType ? (Array.isArray(value) ? "array" : valueType) : valueType,
            value: value
        }
    };
}



/** Dual Field Selector
 * 
 * @param {object} params
 * @param {str} params.name The name of the field
 * @param {boolean} params.isCreate Is the field in "create" mode.
 * @param {boolean} params.isEdit Is the field in "edit" mode.
 * @param {function} params.onChange onChange Callback to update the field data.
 * @param {object} params.pageData Page data as received from API.
 * @param {object} params.pageMetadata Page metadatadata as received from API.
 * @param {object} params.value Current field data.
 * 
 * @returns Component ready to be placed.
 */
const DualFieldSelector = ({
    name,
    isCreate = false,
    isEdit = false,
    onChange = null,
    pageData,
    pageMetadata,
    value = null,
}) => {

    // const [availableOptions, setAvailableOptions] = useState([{
    //     text: 'Option 1',
    //     selected: false,
    //     isVisible: true
    // }, {
    //     text: 'Option 2',
    //     selected: false,
    //     isVisible: true
    // }, {
    //     text: 'Option 3',
    //     selected: false,
    //     isVisible: true
    // }, {
    //     text: 'Option 4',
    //     selected: false,
    //     isVisible: true
    // }]);



    const fieldData = useMemo(() => {

        let data = {}

        pageMetadata.fields[name].choices.map(({ value, display_name }) => {

            data[value] = {
                text: display_name,
                selected: false,
                isVisible: true
            }

        });


        if( pageData ) {

            pageData[name]?.map((permission) => {

                data[permission.id]["selected"] = true

            });
        }


        return Object.entries(data).map(([id, data]) => {
            return {
                id: id,
                text: data.text,
                selected: data.selected,
                isVisible: data.isVisible
            };
        });

    }, [pageData, pageMetadata])


    const [availableOptions, setAvailableOptions] = useState([
        ...fieldData
            .filter(option => !option.selected)
    ]);

    const [chosenOptions, setChosenOptions] = useState(
        
        fieldData
            .filter(option => option.selected).map((option) => {

                return {
                    id: option.id,
                    text: option.text,
                    selected: false,
                    isVisible: option.isVisible
                };

            })
    );

    const moveSelected = fromAvailable => {

        const sourceOptions = fromAvailable ? availableOptions : chosenOptions;

        const destinationOptions = fromAvailable ? chosenOptions : availableOptions;

        for (let i = 0; i < sourceOptions.length; i++) {

            const option = sourceOptions[i];

            if (option.selected && option.isVisible) {

                sourceOptions.splice(i, 1);

                destinationOptions.push(option);

                option.selected = false;

                i--;
            }
        }


        if (fromAvailable) {

            setAvailableOptions([
                ...sourceOptions
                    .sort((a, b) => a.text.localeCompare(b.text))
            ]);

            setChosenOptions([
                ...destinationOptions
                    .sort((a, b) => a.text.localeCompare(b.text))
            ]);

            if( onChange ) {
                onChange(
                    eventConstructor(name, destinationOptions.map(option => Number(option.id)))
                )
            }


        } else {

            setChosenOptions([
                ...sourceOptions
                    .sort((a, b) => a.text.localeCompare(b.text))
            ]);

            setAvailableOptions([
                ...destinationOptions
                    .sort((a, b) => a.text.localeCompare(b.text))
            ]);

            if( onChange ) {
                onChange(
                    eventConstructor(name, sourceOptions.map(option => Number(option.id)))
                )
            }


        }
    };


    const moveAll = fromAvailable => {

        if (fromAvailable) {

            setChosenOptions([
                ...availableOptions
                    .filter(option => option.isVisible), ...chosenOptions
                ]
                    .sort((a, b) => a.text.localeCompare(b.text))
            );

            setAvailableOptions([
                ...availableOptions
                    .filter(option => !option.isVisible)
                ]
                    .sort((a, b) => a.text.localeCompare(b.text))
            );

        } else {

            setAvailableOptions([
                ...chosenOptions
                    .filter(option => option.isVisible), ...availableOptions
                ]
                    .sort((a, b) => a.text.localeCompare(b.text))
            );

            setChosenOptions([
                ...chosenOptions
                    .filter(option => !option.isVisible)
                ]
                    .sort((a, b) => a.text.localeCompare(b.text))
            );
        }
    };


    const onOptionSelect = (event, index, isChosen) => {

        if (isChosen) {

            const newChosen = [...chosenOptions];

            newChosen[index].selected = !chosenOptions[index].selected;

            setChosenOptions(newChosen);

        } else {

            const newAvailable = [...availableOptions];

            newAvailable[index].selected = !availableOptions[index].selected;

            setAvailableOptions(newAvailable);
        }
    };



  return (
    <>
    <DualListSelector>

        <DualListSelectorPane
            title="Available options"
            status={`${availableOptions.filter(option => option.selected && option.isVisible).length} of ${availableOptions.filter(option => option.isVisible).length} options selected`}
        >
            <DualListSelectorList>

                {availableOptions.map((option, index) => option.isVisible ?
                <DualListSelectorListItem
                    key={index}
                    isSelected={option.selected}
                    id={`basic-available-option-${index}`}
                    onOptionSelect={e => onOptionSelect(e, index, false)}
                >
                    {option.text}
                </DualListSelectorListItem> : null)}

            </DualListSelectorList>
        </DualListSelectorPane>

        <DualListSelectorControlsWrapper>
            <DualListSelectorControl
                isDisabled={!availableOptions.some(option => option.selected)} onClick={() => moveSelected(true)}
                aria-label="Add selected" icon={<AngleRightIcon />} 
            />
            <DualListSelectorControl
                isDisabled={availableOptions.length === 0} onClick={() => moveAll(true)}
                aria-label="Add all" icon={<AngleDoubleRightIcon />}
            />
            <DualListSelectorControl
                isDisabled={chosenOptions.length === 0} onClick={() => moveAll(false)}
                aria-label="Remove all" icon={<AngleDoubleLeftIcon />}
            />
            <DualListSelectorControl
                onClick={() => moveSelected(false)}
                isDisabled={!chosenOptions.some(option => option.selected)}
                aria-label="Remove selected" icon={<AngleLeftIcon />}
            />
        </DualListSelectorControlsWrapper>

        <DualListSelectorPane
            title="Chosen options"
            status={`${chosenOptions.filter(option => option.selected && option.isVisible).length} of ${chosenOptions.filter(option => option.isVisible).length} options selected`}
            isChosen
        >
            <DualListSelectorList>

                {chosenOptions.map((option, index) => option.isVisible ?
                <DualListSelectorListItem 
                    key={index}
                    isSelected={option.selected}
                    id={`composable-basic-chosen-option-${index}`}
                    onOptionSelect={e => onOptionSelect(e, index, true)}
                >
                    {option.text}
                </DualListSelectorListItem> : null)}

            </DualListSelectorList>
        </DualListSelectorPane>

    </DualListSelector>
    <input id={name} type="hidden" name={name} value = {`[${chosenOptions.map((option) => option.id)}]`} />
    </>
    )

};



export default DualFieldSelector

