import {
    loaderNamedParams
} from ".";

import {
    apiObject
} from "../../types/backend/apiObject/object";

import {
    APIMetadata
} from "../../../types/APIMetadata";

import useDjangoFetcher from "../../hooks/useDjangoFetcher";



/**
 * 
 * This loader uses a {@link useDjangoFetcher | Django backend} to fetch both
 * the data and metadata.
 * 
 * @summary Django loader that fetches both Data and Metadata.
 * 
 * @category Loader
 * @expandType loaderNamedParams
 * @since 0.13.0
 */
const djangoLoader = async ({
    baseURL,
    request,
}: loaderNamedParams
): Promise<{metadata: APIMetadata, page_data: apiObject}> => {


    const {apiMetadata, apiData} = await useDjangoFetcher({
        getMetadata: true,
        url: request.url,
        baseURL: baseURL,
        signal: request.signal,
    })

    return {
        metadata: await apiMetadata.clone().json(),
        page_data: await apiData.clone().json()
    }

}

export default djangoLoader;
