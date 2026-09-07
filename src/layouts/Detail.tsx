import Detail from "../layout/Detail";



/**
 * Detail Layout is for displaying a single object from a dataset. The object
 * is obtained from the backend via a {@link apiObject}.
 * 
 * This view also provides for creating a new object. This is done by ensuring
 * that the tail of the url is `/add`. When this layout detects this, you will
 * be provided the form fields that are used to create the new object.
 * 
 * @summary Provides the layout for a single object.
 * 
 * @category Layout
 * @see {@link apiObject} for backend object structure.
 * @see {@link layoutDetail} for describing this layout.
 * @see [Detail Layout - Demo Site](https://centurion-ui.nofusscomputing.com/layout/detail/1)
 * @since 0.14.0
 */
const DetailLayout = () => Detail();

export default DetailLayout;
