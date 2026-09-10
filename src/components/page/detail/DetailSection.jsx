import {
    useEffect,
    useState
} from "react";

import {
    Form,
    useLocation
} from "react-router";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
} from "@patternfly/react-core";


import nunjucks from 'nunjucks'

import { apiFetch } from "../../../hooks/apiFetch";
import Badge from "../../Badge";
import DisplayFields from "../../DisplayFields";
import DisplayTable from "../../DisplayTable"
import URLSanitize from "../../../functions/URLSanitize";



/** DetailView Section
 * 
 * Builds a tab section for DetailView.
 * 
 * @param {Object} layout Section layout.
 * @param {Object} data Section data.
 * @param {Object} metadata API Metadata.
 * @param {Object} name Tab name
 * 
 * @returns Card Component ready to be placed.
 */
const DetailSection = ({
    FormComponent = Form,
    layout,
    data,
    metadata,
    name,
    index = null,
}) => {

    const [external_links, setExternalLinks] = useState({})

    const location = useLocation();

    let cardData

    if( layout.layout === 'table' ) {

        if( layout.field in data._urls ) {

            cardData = (
                <DisplayTable
                    data_url_path={URLSanitize(String(data._urls[layout.field]))}
                    add_button_filter = {layout?.sub_models ? layout.sub_models : []}
                />
            )
        } else {
            cardData = 'column data missing'
        }

    } else {

        cardData = (
            <DisplayFields
                existingFormData = {data}
                FormComponent = {FormComponent}
                isCreate = {String(location.pathname).endsWith('/add')}
                layout = {layout}
                metadata = {metadata}
            />
        )
    }


    useEffect(() => {

        if( index === 0 && !String(location.pathname).endsWith('/add')) {

            if( 'external_links' in data._urls ) {

                apiFetch(
                    URLSanitize(data._urls.external_links),
                    (response) =>{

                        setExternalLinks(response)

                    },
                )
            }
        }

    },[])


    let context = {}

    context[String(metadata.name).toLowerCase()] = data


    return (
        <Card
            grow={{ default: 'grow' }}
            isPlain
        >
            <CardHeader
                actions={{
                    actions: (Object.keys(external_links).length > 0 &&

                        (index === 0 && String(name).toLowerCase() == 'details') &&

                            external_links.results.map((external_link) => (
                            <>

                                <Badge
                                    background = {external_link.colour ? external_link.colour : null}
                                    to = {nunjucks.renderString(external_link.display_name, context)}
                                    target="_blank"
                                >
                                    {external_link.button_text ? external_link.button_text : external_link.name}
                                </Badge>
                            </>
                            ))

                    ), 
                    hasNoOffset: false
                }}
            >

                <CardTitle>{'name' in layout ? layout.name : index === 0 ? name : ''}</CardTitle>

            </CardHeader>

            <CardBody>{cardData}</CardBody>

        </Card>
    );
}

export default DetailSection;
