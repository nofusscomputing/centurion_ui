
/**
 * URLs are recommended to be relative URLs.
 * 
 * If the {@link apiObject} uses fields that are of {@link MetadataFieldType}
 * Relationship. the corresponding url is added as a URL to this object.
 * 
 * @category Backend / Data Type
 * @since 0.1.0
 */
export interface APIDataObjectUrls {
    /**
     * Own URL for this object.
     */
    _self: string;

    /**
     * Additional URLs
     */
    [key: string]: string;
}
