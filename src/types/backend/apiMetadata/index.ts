
/**
 * This object contains the fields / keys that are common for all metadata
 * objects.
 * 
 * @category Type
 * @since 0.1.0
 */
export interface apiCommonMetadata {

    /**
     * Allowed HTTP methods.
     * 
     * The backend should update these as per the users permissions.
     */
    allowed_methods: [
        'DELETE'?,
        'GET'?,
        'HEAD'?,
        'PATCH'?,
        'POST'?,
        'PUT'?,
        'OPTIONS'?,
    ]

}
