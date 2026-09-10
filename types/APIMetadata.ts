

/**
 * 
 * API Metadata object is used to describe both {@link apiDataset} and {@link apiObject}.
 * 
 * @summary Object Metadata.
 * 
 * @category Backend
 * @deprecated use {@link apiMetadata}
 * @expand
 */
export interface APIMetadata {

    /**
     * Field definitions describing the {@link apiObject}
     * 
     * @expandType apiField
     */
    fields: apiField[];

    /**
     * Navigation structure for the website.
     */
    navigation?: object;

    /**
     * URL relevant to the current object
     * 
     * @expandType MetadataUrls
     */
    urls: MetadataUrls;
}

/**
 * @expand
 */
export interface apiField {
    key: string;

    /**
     * @expandType MetadataField
     */
    value: MetadataField
}

/**
 * 
 * These are the available field types.
 * 
 * @category Backend / Data Type
 */
export type MetadataFieldType = "Boolean" |
    "DateTime" |
    "Icon" |
    "Integer" |
    "JSON" |
    "Markdown" |
    "Relationship" |
    "String";



/**
 * 
 * These URLs are related to the current object.
 * 
 * @category Backend / Data Type
 * @expand
 */
export interface MetadataUrls {

    /**
     * The URL to the current object.
     */
    self: string;

    /**
     * The URL to use to create a new object.
     * 
     * When not specified the value of `self` is used.
     */
    new?: string;

    /**
     * Urls to any sub-models this object has where key is unique value and url
     * is the value.
     */
    sub_models?: object;
}



/**
 * 
 * What layout the dataset should be laid out in.
 * 
 * @category Backend / Data Type
 * @expand
 */
export interface MetadataField {
    /**
     * Description of the field.
     */
    help_text: string;
    label: string;
    multi_line: boolean;
    read_only: boolean;
    required: boolean;
    /**
     * @expandType MetadataFieldType
     */
    type: MetadataFieldType;
    write_only: boolean;

    [key: string]: any;
}
