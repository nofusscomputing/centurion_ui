import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useLoaderData,
} from "react-router"

import {
    PageSection
} from "@patternfly/react-core";

import { apiFetch } from "../hooks/apiFetch";
import {
    DataSetFooter,
    DataSetHeader,
    DataSetList
} from "../components/DataSet";
import IconLoader from "../components/IconLoader";

import URLSanitize from "../functions/URLSanitize";

import {
    usePageContext
} from "../layouts/PageContent";



/**
 * List layout
 * 
 * This component is intended to display a dataset. That is many rows of data
 * that is of the same type.
 * 
 * @summary List Page Layout
 * 
 * @category Layout
 * @see [List Layout - Demo Site](https://centurion-ui.nofusscomputing.com/layout/table)
 * @since 0.1.0
 */
const List = (): React.JSX.Element => {

    
    const {
        // @ts-ignore TS2339
        setPageDescription, setPageHeading, setPageHeaderIcons
    } = usePageContext();

    const { metadata: loaderMetadata, page_data: loaderPageData } = useLoaderData<{metadata: APIMetadata, page_data: APIDataset}>();

    const [ loaded, setLoaded ] = useState(loaderMetadata ? true : false);

    const [ metadata, setMetadata ] = useState(null);

    const [ page_data, setPageData ] = useState(null);

    const [ pageNumber, setPageNumber ] = useState(1);

    const [ perPage, setPerPage ] = useState(10);

    const [ reload, setReload ] = useState(false);

    const [ selectedRows, setSelectedRows ] = useState([]);

    /** Update the Selected DataList rows
     * 
     * `rowIds` can be any of the following:
     * 
     * - `all` - Will Select all rows
     * 
     * - a single number - if the number exists in the data, will be removed. otherwise it's added.
     * 
     * - An array of numbers - Will replace the current values.
     * 
     * @param {"all" | number | number[]} rowIds - Row IDs for all of the select rows 
     */
    const selectRows = ( rowIds ) => {

        if( rowIds === "all" ) {

            setSelectedRows( page_data.results.map(item => item.id) );

        } else if( typeof(rowIds) === "number") {

            setSelectedRows(
                selectedRows.includes(rowIds)
                ? selectedRows.filter(v => v !== rowIds)
                : [...selectedRows, rowIds]
            );

        } else {

            setSelectedRows( rowIds );

        }

    }


    useEffect(() => {

        setMetadata(loaderMetadata);

        setPageData(loaderPageData);

    }, [
        loaderMetadata,
        loaderPageData,
    ])


    useEffect(() => {

        setPageHeading(loaderMetadata?.name)
        setPageDescription(loaderMetadata?.description)


        setPageHeaderIcons(
            <>
                {loaderMetadata?.['documentation'] &&
                    <Link to={loaderMetadata['documentation']} target="_new">
                        <IconLoader
                            name='help'
                            size="xl"
                            inline={false}
                        />
                    </Link>
                }
            </>
        );

        setPageNumber(loaderPageData?.meta.pagination.page);

        setPerPage(10);

        setSelectedRows([]);

    }, [
        loaderMetadata,
        loaderPageData
    ])


    useEffect(() =>{    // Fetch the table data if the page number has changed.

        if( ! page_data && ! metadata ) return;

        let url = null

        if( pageNumber !== 1) {

            url = `${URLSanitize(metadata.urls.self)}?page%5Bnumber%5D=${String( pageNumber )}`;

        }else{

            url = URLSanitize(metadata.urls.self);

        }

        if(
            loaded === false
            || page_data.meta.pagination.page !== pageNumber
            || reload
        ) {
            apiFetch( url )
                .then((result) => {

                    if( result.status == 200 ) {

                        if( result.api_metadata !== null ) {

                            setMetadata(result.api_metadata);
        
                        }
        
                        setPageData(result.api_page_data)

                        setLoaded(true);
                        setReload(false)
                    }
                }
            )
        }

    }, [
        pageNumber,
        reload
    ]);


    return (
        metadata && page_data &&
        <>
            <DataSetHeader
                component = {PageSection}
                itemCount = {page_data.meta.pagination.count}
                metadata = {metadata}
                perPage = {perPage}
                selectedRows = {selectedRows}
                selectRows = {selectRows}
            />
            <DataSetList
                component = {PageSection}
                componentProps = {{
                    isFilled: true
                }}
                fieldNames = {true}
                isCheckable = {true}
                rowData = {page_data}
                metadata = {metadata}
                selectedRows = {selectedRows}
                selectRows = {selectRows}
            />

            <DataSetFooter
                component = {PageSection}
                componentProps={{
                    stickyOnBreakpoint: { default: "bottom" }
                }}
                itemCount = {page_data.meta.pagination.count}
                pageNumber = {pageNumber}
                perPage = {perPage}
                setPageNumber = {setPageNumber}
                setPerPage = {setPerPage}
            />
        </>
    );
}

export default List;
