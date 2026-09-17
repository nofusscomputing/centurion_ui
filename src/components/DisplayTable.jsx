import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams,
} from "react-router";

import {
    Button,
    Pagination,
    PaginationVariant,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from "@patternfly/react-core";

import {
    ExpandableRowContent,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@patternfly/react-table";

import ActionDialog from "./ActionDialog";
import { apiFetch } from "../hooks/apiFetch";
import Dialog from "../layout/Dialog";
import FieldData from "../functions/FieldData";
import IconLoader from "./IconLoader";
import URLSanitize from "../functions/URLSanitize";




/**
 * Create a Table with pagination
 * 
 * if a table field is not a string but an array of strings, they will be rendered
 * as a collapsible row directly underneath each row.
 * 
 * @param {{String, Function}} param0 Object for table
 * @param data_url_path url where the data will be fetched
 * @param callback function that will be passed value `data.name`
 * @param add_button_filter List of kecys to filter the dynamic add button
 * 
 * @param {bool} isNested Is the table being created being nested in expandable row
 * 
 * @returns Component ready to be placed on a card.
 */
const DisplayTable = ({
    callback = null,
    SetContentHeaderIcon = null,
    add_button_filter = [],
    /**
     * Refactor: required Fields below
     */
    data_url_path,
    isNested = false,
    loader_data = null,    // todo: rename tableData
    loader_metadata = null,    // todo: rename tableMetadata
}) => {

    const [loaded, setPageLoaded] = useState(loader_data ?  true : false)

    const [ isCreate, setIsCreate ] = useState(false);

    const [metadata, setMetaData] = useState(loader_metadata ? loader_metadata : null);

    const [pageNumber, setPageNumber] = useState(1);

    const params = useParams();

    const [perPageNumber, setPerPage] = useState(10);

    const [ reload, setReload ] = useState(false)

    const [table_data, setTableData] = useState(loader_data ? loader_data : null);

    let collapsable_fields = [];

    let table_columns_count = 0;

    if( ! String(data_url_path).startsWith('/') ) {

        data_url_path = '/' + data_url_path;

    }


    useEffect(() => {

        if( SetContentHeaderIcon ) {

            SetContentHeaderIcon(
                <>
                    {loader_metadata['documentation'] &&
                        <Link to={loader_metadata['documentation']} target="_new">
                            <IconLoader
                                name='help'
                                size="xl"
                                inline={false}
                            />
                        </Link>
                    }
                </>
            );
        }

        if( callback ) {

            if( loader_metadata ) {

                callback(loader_metadata.name);

            }
        }

        if( loader_data && loader_metadata ) {

            setMetaData(loader_metadata ? loader_metadata : null)
            setTableData(loader_data ? loader_data : null)
            setPageNumber(1)

        }


    }, [
        loader_data,
        loader_metadata,
    ])


    useEffect(() =>{    // Fetch the table data if the page number has changed.

        let url = null

        if( pageNumber !== 1) {

            url = data_url_path + '?page%5Bnumber%5D=' + String( pageNumber );

        }else{

            url = data_url_path;

        }

        if(
            // (
            //     (loaded === false || table_data?.meta.page !== pageNumber )
            //     && !isNested
            // )
            loaded === false
            || table_data.meta.pagination.page !== pageNumber
            || reload
        ) {
            apiFetch( url )
                .then((result) => {

                    if( result.status == 200 ) {

                        if( result.api_metadata !== null ) {

                            setMetaData(result.api_metadata);
        
                        }
        
                        setTableData(result.api_page_data)

                        if( result.api_metadata.layout.table.length < 2 ) {

                            console.error("Missing Table Fields");

                        }

                        if( SetContentHeaderIcon ) {

                            SetContentHeaderIcon(
                                <>
                                    {result.api_metadata['documentation'] &&
                                        <Link to={result.api_metadata['documentation']} target="_new">
                                            <IconLoader
                                                name='help'
                                            />
                                        </Link>
                                    }
                                </>
                            );
                        }

                        if( callback ) {

                            callback(result.api_metadata.name);

                        }

                        setPageLoaded(true);
                        setReload(false)
                    }
                }
            )
        }
    }, [
        pageNumber,
        reload
    ]);


    const AddButton = () => {


        if( 'pk' in params && ! Object.hasOwn(metadata.urls, 'new') ) {
        /**
         * If the model has the pk param then inline editing should be enabled.
         */

            return (
                <>
                {metadata &&

                    <Button
                        variant="primary"
                        onClick={() => {
                            setIsCreate(true)
                        }}
                    >
                        {isCreate ? "Cancel" : "Add"}
                    </Button>

                }
                </>
            );

        } else {
        

            if(
                metadata?.urls?.sub_models != null
                && add_button_filter.length > 0
            ) {

                return Object.keys(metadata.urls.sub_models).map((model_name) => {

                    if( add_button_filter.includes(model_name) ) {            

                        return (
                            <Button
                                variant="primary"
                                component={(props) => <Link {...props} to={URLSanitize(metadata.urls.sub_models[model_name].url) + "/add"} />}
                            >
                                Add {model_name}
                            </Button>
                        );

                    }else{

                        return;

                    }
                });

            } else {

                return (
                        <Button
                            variant = "primary"
                            component = {
                                (props) => <Link
                                    {...props}
                                    to={URLSanitize(metadata.urls?.new ? metadata.urls.new : metadata.urls.self) + "/add"}
                                />
                            }
                        >
                            Add
                        </Button>
                );
            }

        }


    }

    const handleDialogOnClose = (_event) => {
        setReload(true);
        setIsCreate(false);
    }



    const PaginationBottom = () => {

        if( isNested ) {
            return
        }

        const onSetPage = (_event, newPage) => {
            setPageNumber(newPage);
        };

        const onPerPageSelect = (_event, newPerPage, newPage) => {
            setPerPage(newPerPage);
        };

        return (
            <Pagination
                itemCount={table_data.meta.pagination.count}
                widgetId="bottom-pagination"
                perPage={perPageNumber}
                perPageOptions={[
                    { title: '10', value: 10 },
                    // { title: '20', value: 20 },
                    // { title: '50', value: 50 },
                    // { title: '100', value: 100 }
                ]}
                page={pageNumber}
                variant={PaginationVariant.bottom}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect} />
        );
    };



    const toolbar = (
        <Toolbar id="search-input-filter-toolbar">
            <ToolbarContent>
                <ToolbarItem>
                    { metadata && metadata.allowed_methods.includes('POST') && <AddButton /> }
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );




    const [expandedTableRowNames, setExpandedTableRowNames] = useState([]);

    const setTableRowExpanded = (tableRowId, isExpanding = true) =>

        setExpandedTableRowNames((prevExpanded) => {

        const otherExpandedTableRowNames = prevExpanded.filter((r) => r !== tableRowId);

        return isExpanding ? [...otherExpandedTableRowNames, tableRowId] : otherExpandedTableRowNames;

    });

    const isTableRowExpanded = (tableRowId) => expandedTableRowNames.includes(tableRowId);



    const tableHeaderColumns = metadata?.layout.table.map((key, index) => {

        collapsable_fields = []

        if( table_columns_count === 0 ) {

            for( let field of metadata.layout.table ) {

                if(
                    typeof(field) === 'string'
                    || typeof(field) === 'object'
                ) {

                    table_columns_count += 1;

                }
            }
        }

        if(
            key in metadata.fields
            || String(key).startsWith('-action_')
        ) {

            if( typeof(key) === 'string' ) {

                if (key === 'nbsp') {

                    return (
                        <Th>&nbsp;</Th>
                    );

                } else if ( key === '-action_delete-' ) {

                    return (
                        <Th key={key}>&nbsp;</Th>
                    );

                } else {

                    return (
                        <Th key={key}>{metadata.fields[key].label}</Th>  
                    );
                }
            }

        } else if( typeof(key) === 'object' ) {

            if(
                typeof(key) === 'object'
                && key.field
            ) {

                return (
                    <Th key={key}>{metadata.fields[key.field].label}</Th>
                );

            } else {

                for( let sub_key of key ) {

                    collapsable_fields.push(sub_key);

                }
            }
        }
    });


    return (
        <>
        { loaded && (metadata && table_data) &&
            <>

                {!isNested && toolbar}
                    <Table
                        isExpandable
                        hasAnimations
                        variant={isNested ? 'compact' : null}
                    >
                        <Thead>
                            <Tr>
                            {collapsable_fields.length > 0 && <Th screenReaderText="Row expansion" />}
                            {tableHeaderColumns}
                            { table_columns_count > 0 &&
                                <Th>&nbsp;</Th>
                            }
                            </Tr>
                        </Thead>

                        {isCreate &&
                            <Dialog
                                handleOnClose={handleDialogOnClose}
                                isCreate = {isCreate}
                                objectMetadata={metadata}
                            />
                        }

                        {table_data && table_data.results.map((data, rowIndex) => {

                        const rowId = `${String(metadata.name).replace(' ', '-').toLowerCase()}-${data.id}`;

                        return (
                            <Tbody
                                isExpanded={isTableRowExpanded(rowId)}
                                key={rowId}
                            >
                                <Tr
                                    isContentExpanded={isTableRowExpanded(rowId)}
                                >
                                    { collapsable_fields.length > 0 &&
                                        <Td
                                            expand={
                                                collapsable_fields.length > 0
                                                ? {
                                                    rowIndex,
                                                    isExpanded: isTableRowExpanded(rowId),
                                                    onToggle: () => setTableRowExpanded(rowId, !isTableRowExpanded(rowId)),
                                                    expandId: rowId
                                                    }
                                                : undefined
                                            }
                                            key={`collapsable_field-${rowId}`}
                                        />
                                    }

                                    {metadata.layout.table.map(key => {

                                        if (
                                            key in metadata.fields
                                            || String(key).startsWith('-action_')
                                            || String(key?.type) === 'link'
                                        ) {

                                            if( typeof(key) === 'string' ) {

                                                if (key === 'nbsp') {

                                                    return (
                                                        <Td dataLabel={key}>&nbsp;</Td>
                                                    );

                                                } else if (key === '-action_delete-') {

                                                    return (
                                                        <Td dataLabel={key}>
                                                            <ActionDialog
                                                                objectData = {data}
                                                                objectMetadata={metadata}
                                                                updateCallback = {(success, id) => {

                                                                    success && setTableData(

                                                                        prev => {
                                                                            return {
                                                                            ...prev,
                                                                            results: prev.results.filter(row => row.id !== id)
                                                                        }}
                                                                    )
                                                                }}
                                                                type="delete"
                                                            />
                                                        </Td>
                                                    );

                                                }else {

                                                    let autolink = false

                                                    if(
                                                        key == 'name'
                                                        || key == 'title'
                                                        || Boolean(metadata.fields[key].autolink)
                                                    ) {
                                                        autolink = true
                                                    }

                                                    return (
                                                        <Td
                                                            dataLabel={key}
                                                            key={key}
                                                        >
                                                            <FieldData
                                                                autolink = {autolink}
                                                                data={data}
                                                                field_name={key}
                                                                metadata={metadata}
                                                            />
                                                        </Td>
                                                    );
                                                }

                                            } else if( typeof(key) === 'object' ) {

                                                if( String(key.type) === 'link' ) {

                                                    return (
                                                        <Td dataLabel={key}>
                                                            <FieldData
                                                                autolink = {true}
                                                                data={data}
                                                                field_name={key}
                                                                metadata={metadata}
                                                            />
                                                        </Td>
                                                    );
                                                }
                                            }
                                        }
                                    })}
                                    <Td></Td>
                                </Tr>
                                {collapsable_fields.length > 0 &&
                                <Tr isExpanded={isTableRowExpanded(rowId)}>
                                    <Td colSpan={(metadata.layout.table.length+1)}>
                                        <ExpandableRowContent>
                                        {isTableRowExpanded(rowId) && <>
                                            <DisplayTable
                                                isNested={true}
                                                loader_data={Object({
                                                    "results": [ data ],
                                                    "meta": {
                                                        "pagination": {
                                                            "page": 1,
                                                            "pages": 1,
                                                            "count": 1
                                                        }
                                                    }
                                                })}
                                                loader_metadata={
                                                    Object({
                                                        ...metadata,
                                                        layout: {
                                                            ...metadata.layout,
                                                            table: [
                                                               ...collapsable_fields,
                                                            ]
                                                        },
                                                    })
                                                }
                                            />
                                        </>}
                                        </ExpandableRowContent>
                                    </Td>
                                </Tr>
                                }
                            </Tbody>
                        );
                        })}
                    </Table>
                {table_data && <PaginationBottom />}
            </>
        }
        </>
    );
}
 
export default DisplayTable;
