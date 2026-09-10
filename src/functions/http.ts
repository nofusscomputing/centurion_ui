import {
    HTTPNotAuthenticated
} from "../classes/Exceptions";



/**
 * Named parameters for a HTTP request.
 * 
 * @category NamedParameters
 * @expand
 * @since 0.13.0
 */
export interface HTTPNamedParams {

    /**
     * Body to use for request.
     */
    body?: RequestInit["body"] | null,

    /**
     * Send Credentials with request.
     * 
     * When set to `true` credentials will be set to `same-orign`
     */
    credentials?: 'omit' | 'include' | 'same-origin'

    referrerPolicy?: RequestInit["referrerPolicy"]

    mode?: 'no-cors' | 'cors' | 'same-origin'

    /**
     * Headers to add to the request.
     */
    headers?: RequestInit["headers"],

    /**
     * HTTP method to use for the request.
     */
    method?: "GET" | "OPTIONS" | "POST" | "PATCH",

    /**
     * Request signal.
     */
    signal?: AbortSignal

    /**
     * URL for the request to be made against.
     */
    url: string,
}



/**
 * This object is intended to serve as the single point for all HTTP requests
 * that the UI will make.
 * 
 * @example
 * 
 * When calling this fetcher, ensure that you have provided everything required
 * to make the request.
 * 
 * ``` js
 * 
 * const myRequest = httpRequest({
 *      url: "https://my-domain-name.tld/some-path",
 *      headers: {
 *          "Content-Type": "application/json"
 *      },
 *      body: {
 *          "a_key": "a value"
 *      }
 * })
 * 
 * ```
 * 
 * @summary HTTP fetcher.
 * 
 * @category Fetcher
 * @expandType HTTPNamedParams
 * @since 0.13.0
 * @throws {@link HTTPNotAuthenticated} HTTP/401 was returned.
 */
export async function httpRequest({
    body = null,
    credentials = undefined,
    referrerPolicy = undefined,
    mode = undefined,
    headers = {},
    method = undefined,
    signal = null,
    url,
}: HTTPNamedParams): Promise<Response> {


    let options: RequestInit = {
        credentials: credentials ? credentials : 'omit',
        referrerPolicy: referrerPolicy ? referrerPolicy : 'strict-origin-when-cross-origin',
        headers: {
            ...headers,
            // "X-Request-ID": crypto.randomUUID()
        },
        method: method ? method : 'GET',
        mode: mode ? mode : 'no-cors',
        ...( signal ? { signal: signal } : {} )
    };


    if( body ) {
        options['body'] = body;
    }


    const Request = await fetch(
        url,
        options
    ).then(response => {

        if( response.status === 401 ) {

            throw new HTTPNotAuthenticated( response )

        }

        return response

    });


    return Request;

}
