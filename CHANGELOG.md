## 0.14.0 (2026-09-10)

### feat

- **component**: Add About modal dialog
- **component**: Whn in mobile view Add header "refresh" button to hamburger menu
- Add error boundary to PageContent route
- Add the navigation description
- **function**: As part of dynamic route loading, cache the root metadata
- **function**: Use routes supplied by backend

### Refactoring

- **component**: Enable Form component passthrough
- **layout**: Update TicketLayout to use fetch.Form
- **layout**: migrate backend data types
- **layout**: Add placeholder DetailLayout until Detail is refactored.

## 0.13.2 (2026-08-30)

### Fixes

- When adding an object its add action must be added to parent route

## 0.13.1 (2026-08-30)

### Fixes

- **layout**: Ensure that when adding new model, that gates exist
- Correct settings routes

## 0.13.0 (2026-08-29)

### feat

- **fetcher**: Ensure that when useGithubFetcher is called that any supplied backendURL is ignored and obtained from the backend provider
- **fetcher**: Ensure that when useDjangoFetcher is called that any supplied backendURL is ignored and obtained from the backend provider
- **loader**: Add Github markdown route loader
- **fetcher**: Add Github HTTP
- **fetcher**: Add Markdown HTTP
- **layout**: Add BackendLayout
- **fetcher**: Add support to jsonHttp fetcher to configure credentials, referrer Policy and mode
- **fetcher**: Add support to http fetcher to configure credentials, referrer Policy and mode
- **loader**: Provide `baseURL` directly to loaders
- **provider**: Make BackendProvider dynamic in that it will obtain the url from a route handle var.
- **fetcher**: Use backendURL from route context when available.
- **loader**: Add context prop to ALL loaders
- **function**: Add routesFromObject for building routes from object
- Add route middleware backendURLMiddleware
- **layout**: Add ability to specify additional page footer to be appended
- **layout**: Notification Layout
- Add PageContent to Router
- **loader**: Add Django Root Metadata loader
- **layout**: Add Layout for app / site / UI common
- **component**: Add content refresh / reload to site header
- **layout**: Add common page content layout
- **provider**: Add Backend provider
- **layout**: Add Logout
- **layout**: Add Login
- **layout**: Add Base
- **loader**: Add Django metadata ONLY Loader
- **loader**: Add Django Loader
- **function**: Add Django backend fetcher
- **function**: Add JSON HTTP base fetcher
- **function**: Add signal parameter to httpFetcher
- **function**: Add HTTP base fetcher
- Add Base HTTP Exceptions
- **fetcher**: Add HTTP fetcher skeleton

### Fixes

- **function**: Ensure that the body is passed to the fetcher within apiFetch
- **function**: Add to routesFromObject capture of invalid values
- **function**: when building routes from description, if user specifies both backend_url and component ="backend" don't raise error
- **provider**: Iterating through matching routes must included first one.
- **component**: Dont load esm icon, import from module for StateSplash
- **layout**: Redirect routes must not be part of route patching.
- **function**: URLSanitixe needs to handle root '/'

### Refactoring

- **function**: mv defaults from props to object being called
- **function**: Finalise routesFromObject
- split router into own objects for clarity
- no requirement to useMemo on dynamic router as it only loads once anyway
- **layout**: Update and clean Rout Error Boundary
- Update Navbar with proper'er context
- Update Notifications with proper'er context
- **component**: Conviert LoadingSpinner to cover all StateSplash
- **layout**: Squash Login and Logout Layout to Redirect layout
- Update dynamicRouter to patch routes on navigation
- update app entrypoint to be typescript
- move app loading to sub-dir
- move current route to interim dynamic routes fn.
- move LoadingSpinner to own Component
- **hook**: Replace global.fetch with useDjangoFetch
- Update routes so that the httpFetcher thrown exception is caught for redirect

### Tests

- **component**: Test suite for StateSplash
- Unit Test suite for dynamicRouter
- Initial Unit Test suite for route ErrorBoundary
- Initial Unit Test suite for routesFromObject
- Unit Test suite for Entrypoint
- Unit Test suite for app
- **hook**: Unit Test suite for github fetcher
- **layout**: Unit test suite for BackendProviderLayout
- **fetcher**: Unit Test suite for httpMarkdown fetcher
- **loader**: Unit Test suite for github loader
- **provider**: Unit test suite for backendProvider
- **loader**: Unit test suite for djangoRootMetadata Page Loader
- **component**: Update NotificationDrawer test suite to work with UI and PageContent parent router
- **layout**: Update List layout test suite to work with UI and PageContent parent router
- **layout**: PageContent Unit test suite
- **function**: Unit Test case to confirm empty body on HTTP/POST raises error for httpJsonRequest
- **function**: Unit Test case to confirm empty body on HTTP/PATCH raises error for httpJsonRequest
- **loader**: Unit Test Suite for djangoMetadataLoader
- **loader**: Unit Test Suite for djangoLoader
- **layout**: Unit Test Suite for Redirect
- **function**: Add test cases for no path and trailing slant for URLSanitizer

## 0.12.0 (2026-08-11)

### feat

- **component**: If ticket comment updates, re-render
- **component**: Pass fetcher error state to ticket comment
- **component**: For a threaded comment, use different icon to represent
- **component**: EmptyState object added to display when nothing found
- **component**: Add new Card that displays DataSet
- **component**: Update DataSet with Optional Draggable rows
- **component**: Add Title to the Icon HTML element to display on hover
- **component**: Add Custom ListItem
- **layout**: Add front matter tags rendering
- **layout**: New Layout for markdown documents
- **function**: Add parsing of md front matter and returning via callback
- **layout**: Add "Back to Top" button on scroll
- **layout**: As part of breadcrumb add links to model
- **layout**: Add ticket submodel and submodel to breadcrumb
- **layout**: Add spinner to root layout until root metadata is loaded
- **component**: InlineFieldAction updated to use URL specified in form action
- Add action to project ticket route
- **component**: When creating comments and status is HTTP/200, reload comments
- **hooks**: Prevent HTTP/OPTIONS request when performing HTTP/DELETE

### Fixes

- **component**: By default for FormField FormComponent to use react.router.Form
- **function**: Ticket Type uses `type` field not `ticket_type` when rendering markdown
- **layout**: AlertGroup must always be displayed
- **layout**: Pass root metadata version details to footer
- **layout**: Correct ticket description edit to use correct state object
- **component**: Dont attempt to process pageData in DualFieldSelector if it doesnt exist
- correct project task route
- **layout**: When creating a new ticket don't attempt to display comments
- **component**: Only attempt to update comments state on HTTP/201

### Refactoring

- Remove usage of InlineFieldAction
- **component**: Dont't modify actionData object
- **component**: Pass form element to FormField
- **component**: Unless formState must be tracked, use standard HTML forms for FormField
- **layout**: Update Ticket Layout jsx -> tsx including finish PatternFly conversion
- **component**: Set ListItem to be fn
- **component**: Update Expandable nav section to use built-in Icon
- **component**: Update Comment to use correct components
- **layout**: Update Breadcrumbs to use router link as component
- **function**: When catering for route paths, parse as part of cleaning
- **layout**: mv pagebreadcrumb to be part of page
- **layout**: move root metadata fetch to root layout
- **component**: Add URLSanitize to fetching of ticket comments
- **component**: Add usage of "new" url from metadata.urls
- Update project ticket route

### Tests

- **function**: Unit Test Suite for URLSanitize fn
- **unit**: Unit Test Suite Added for markdown front matter parsing

## 0.11.0 (2026-05-31)

### feat

- **layout**: Add paginated navigation of data within list layout

### Fixes

- **component**: Ensure that DisplayFields columns remain the same size
- **component**: Whilst building fieldData for DuelFieldSelector pageData my not yet be available

## 0.10.3 (2026-05-30)

### Fixes

- **component**: When rendering a field as part of DataSetList if it's an link object setup so it renders
- **component**: Existing comment thread URL must be sanitized

## 0.10.2 (2026-05-29)

### Fixes

- **loader**: APISubmitAction must sanitize URL
- metadata lay table is a list of columns, not a object with a key called columns

## 0.10.1 (2026-05-22)

### Fixes

- metadata lay table is a list of columns, not a object with a key called columns
- **component**: For expandable DisplayTable, only pass the expandable fields

## 0.10.0 (2026-05-17)

### feat

- Combine Metadata keys layout and table_fields

### Fixes

- **component**: Correct log for Comment so create form displays

## 0.9.0 (2026-05-15)

### feat

- **layout**: Add Notifications and the corresponding context to the root layout.
- **component**: Add Notifications button to Header toolbar
- **component**: Add NotificationDrawer
- **hook**: NotificationActions added
- **component**: Add DataSet Component for data not suitable for tables
- **function**: URL sanitizer created
- **component**: Add option to FormField for inline editing
- **component**: Add option to for divider between fields
- **component**: fleax display option added to FormField
- **function**: Remove markdown plugin code copy
- **component**: If detail view has description, render it.
- **docker**: Add ability to mock API backend
- **function**: Add markdown render support for sub/sup html rendering
- **function**: Add support for rendering token type `code_block`
- **function**: correctly create input html during markdown render for tasklist
- **component**: MarkdownEditor component instead of TextArea for markdown field
- Remove delete routes
- **component**: Add ActionDialog to perform delete of object
- **component**: Add Dual selector form field
- **component**: Adjust formfield type for relationship ManyToMany
- **component**: Add Number form field
- **component**: Add E-mail form field
- **component**: Add Date form field
- **component**: If a form field is being created and it contains an initial value, populate the field with it
- **component**: Dynamic inline editing setup
- **component**: Add Modal dialog pop-up for adding row for DisplayTable
- **component**: Add Modal dialog for inline editing
- **component**: Add support for passing isCreate to DisplayFields
- **component**: Add support for passing isCreate to FormFields
- **component**: Add support to update the API from ui for inline edit and add
- **component**: Add field editing to DisplayFields
- **component**: Add dynamic form field creator
- **component**: Enable as part of `DisplayTable` to have a nested tab as collapsible per row
- **style**: Set printable area to main HTML tag
- **hook**: Add hook for mobile browser detection
- **component**: Dynamic SVG DOM loader
- **component**: Make user menu functional

### Fixes

- **component**: if field label does not exist when rendering DataSetListCells dont attempt to render one
- **component**: if field does not exist when rendering DataSetListCells ignore the field
- **hook**: When fetching UserSettings sanitize the URL prior to fetching data
- **component**: When rendering DetailSection sanitize the URL to fetch the table data
- **component**: Field name must display within DataSetListCells if it is not field or cell index `0`
- **function**: if autolink part of field metadata and its set, use its value to render data as link to self
- **component**: correct formatting for markdown TicketLink
- **component**: correct formatting for markdown ModelLink
- **layout**: Correct Page Heading and toolbar layout
- **layout**: page_data is a dep for list view
- **component**: move readOnly const to be declared before usage within FormField
- **component**: Only run metadata effects when required
- **component**: Correct FormField initial and state values
- **component**: FormField must display correct data for create, edit and view
- **component**: empty FormField must be removed from state
- **component**: When rendering html fields, ensure readonly attribute is valid HTML
- **component**: When rendering html fields, ensure required attribute is valid HTML
- **component**: When rendering choice/relationship, if initial value is defined, select correct option
- **component**: When rendering switch ensure has aria-label
- **component**: trigger redraw when data and metadata is updated
- Check all route params for route revalidate
- **hook**: If no cookie (credential), dont attempt to send
- **function**: when rendering markdown, env param must be passed
- **function**: when rendering markdown, env not required so default to empty
- **docker**: ensure that when saving app env file, it's to the correct location
- **component**: Ensure that when in Create mode that All object fields are present
- **function**: Short month formatting is three chars long
- **function**: ensure IconLoader has unique key
- **component**: Ensure that if there is no render context for the markdown editor (prieview), set to empty
- **layout**: When adding new object from DetailView, don't show other tabs
- **component**: Dont render markdown if value is emptyautoFit description list
- **component**: Dont autoFit description list
- **component**: render textarea if field is markdown and in edit mode
- **component**: Ensure that DisplayTable re-renders on fresh loader data
- **component**: Get notes form working
- **component**: Correct `NavExpendable` icon spacing
- **component**: Correct flex wrapping for dual column section
- **component**: If creating a new field (single column) dont use the supplied column fields, use all meta fields
- **component**: Track read and write only separately
- **component**: When checking if DisplayTable requires data, use correct page number variable
- **component**: During DisplayTable, if loader data available, load it directly
- **component**: Dont try to call calback if it doesnt exist
- **component**: Add missing column to table
- **component**: Prevent Page title form text wrapping
- **component**: Ensure that string choice field is supported
- **component**: single column fields must not lways be idEdit mode
- **component**: Correct DescriptionList formatting
- **component**: Get nav RouterLinks working again!!!
- User correct API log out URL
- **component**: Add Icons back to nav groups and entries
- **build**: Dont rewrite named groups out of regex strings
- **layout**: remove PageSection component from Main

### Refactoring

- **layout**: Update Settings to use the PatternFly design system
- **component**: convert Navbar from jsx -> tsx
- **component**: convert Footer from jsx -> tsx
- **component**: convert Header jsx -> tsx
- **component**: Convert DisplayFields from js -> ts
- **component**: Convert Comment from js -> ts
- **component**: Convert ActionDialog from js ->ts
- correct form/display field layout
- **layout**: rename Root .jsx -> .tsx
- **component**: rename .jsx -> .tsx
- **layout**: Migrate List layout to use DataSet component
- **layout**: Change list from jsx ->tsx
- **component**: Use fetcher for Comments
- **component**: Update var names for clarity
- **component**: Migrate Ticket RelatedTickets to use PatternFly design system
- **component**: Migrate Ticket LinkedItems to use PatternFly design system
- **layout**: Migrate ticket to use patternfly design system
- **component**: Migrate ticket comment to use patternfly design system
- dont use full path for node module svg imports
- **docker**: demo to be included in base and be default for API_URL
- **function**: Apply PaternFly styles to markdown rendering
- **function**: Render footnotes as jsx object
- **function**: model link to return IconLoad compopnent
- **function**: re-work markdown rendering to return JSX objects
- **layout**: Use MarkdownEditor component for detailView Notes
- **component**: Update MarkdownEditor to use PatternFly
- **component**: Update table row delete to use ActionDialog for deleting row.
- **layout**: Update Ticket to use new root layout
- **component**: Update ModelForm to use new root layout
- **component**: Make tabs page header sticker within DetailView
- **Layout**: Update root Layout to include header and breadcrumbs.
- **layout**: Use loader for history view
- Clean up routes and set-up prop'er nesting
- **component**: Update external links to work with PatternFly
- **component**: Update badge to work with PatternFly
- **component**: Separate the Displayfields Editing and not logic for displaying
- **component**: Add inline form errors to new inline form
- **layout**: Remove edit routes
- **layout**: Move adding a new model to use DetailView
- **layout**: ListView to set it's own header name and icon
- **component**: Update DisplayTable Buttons so they are using PatternFly
- **layout**: Update HistoryView so its using PatternFly
- **component**: Update DisplayTable so that Expandable section is using PatternFly
- **component**: rename Table -> DisplayTable
- **function**: If filed_data is empty use `-`
- **layout**: Update DetailView to PatternFly
- **layout**: Update notes submit button to PatternFly
- **layout**: Place ListView data in card
- **layout**: Update Detail view to use PatternFly
- **component**: Update table to use PatternFly
- **component**: rename component Table -> DisplayTable
- **component**: Update icon loading in footer
- **component**: clean up nav icons components
- **component**: Convert SVG Icons back to SVG files
- **component**: IconLoader now uses SVGIconLoader
- **component**: Navtabs converted to PatternFly
- **component**: Remove NavTabs Back link in favour of Breadcrumbs
- **layout**: Adjust ListView so that it uses PatternFly
- **component**: Use Title Component for HEAD title
- **layout**: Adjust Main (home page) so that it uses PatternFly
- **layout**: Adjust Root so that it uses PatternFly
- **component**: Adjust Navigation so that it uses PatternFly
- **component**: Adjust Footer so that it uses PatternFly
- **component**: Adjust Header so that it uses PatternFly
- **npm**: switch from react-scripts -> webpack

### Tests

- **layout**: Add test case for ticket layout to ensure no errors on load
- **unit**: NotificationDrawer Test Suite
- **layout**: List view test suite
- **component**: DataSet test suite
- **component**: Test Cases for FormField Edit data
- **component**: Test Cases for FormField Add data
- **layout**: Update root test cases to check for error logs and fail tests if any
- **layout**: Unit Test suites for detail and list layouts
- **unit**: CommonMark Horizontal rule test case
- **unit**: CommonMark HTML comment test case
- **unit**: CommonMark Table column alignment
- **unit**: fail any markdown render test case if returned HTML is empty
- **unit**: CommonMark different code block styles
- **unit**: disabled test - CommonMark HTML Comment
- **unit**: CommonMark Strikethrough test cases
- **unit**: Enabled test - Plugin TaskList Whitelist
- **unit**: Plugin TicketLink test cases
- **unit**: disabled test - Plugin TaskList Whitelist
- **unit**: Plugin Emoji test cases
- **unit**: disabled test - Plugin FootNote Whitelist
- **unit**: disabled test - Plugin HTML Whitelist
- **unit**: Plugin TaskList test cases
- **unit**: Plugin Admon test cases
- **unit**: CommonMark List test cases
- **unit**: CommonMark Link test cases
- **unit**: CommonMark Line Breaks test cases
- **unit**: CommonMark Heading test cases
- **unit**: CommonMark Code block test cases
- **unit**: initial test suite for markdown CommonMark cases
- **unit**: Markdown Plugin model_tag
- **mock**: Add mock for fetch

## 0.8.0 (2026-03-03)

### feat

- **page**: Add dynamic Add button to detail Table view
- **components**: Update Markdown field to fetch render data from field
- **components**: make ticket object requests async
- **component**: When loading a ticket comment that has no metdata, fetch it.
- **layout**: When loading ticket comments, check comment type to load metadata
- **layout**: set ticket layout document title to metadata.name
- **layout**: set list layout document title to metadata.name
- **layout**: set detail layout document title to metadata.name
- **base**: update dep js-yaml 4.1.0 -> 4.1.1
- **component**: Add Delete Icon so users can remove objects linked to tickets
- **base**: For the delete icon, set cursor to pointer to denote link
- **component**: Add Delete Icon so users can remove dependent tickets
- **component**: Add icon Customer
- **component**: Add icon Human Resources
- **component**: Add icon Employee
- **icon**: Add directory icon

### Fixes

- **style**: Project Task header color
- Enable input for model notes form
- **component**: dont show select field if its read-only
- **style**: Dont wrap text inside a badge
- **component**: Correctly set ticket sections that should not grow
- **component**: use value attr instead of children
- **component**: Correct row vertical alignment for dependent tickets
- **component**: dont show reply box unless the comment is a thread
- **component**: when handling menu click, get element within handler
- **component**: Dont begin to render tables until data available
- **component**: when loading table, dont fetch data if loader data passed
- **layout**: dont begin rendering detail notes tab unless ob notes tab
- **layout**: dont begin rendering detail page until data is available

### Refactoring

- **component**: support editing new markdown field datatype
- **component**: Dont fetch comments in comment component
- use same code for ticket comment threads
- **component**: Update RelatedTicket
- **layout**: Update Ticket
- **component**: Update TicketCommentForm and TicketComment
- **component**: use a tickets urls._self

## 0.7.0 (2025-08-29)

### feat

- **icon**: Add user icon
- **icon**: Add Tenant and role icon
- **node**: update packages
- Add URL routes for entities
- **base**: Add git_repository route
- **component**: Add GitLab icon
- **component**: Add GitHub icon
- **function**: Add support for table field to be specified as link
- **component**: Add feature flag icon
- **component**: Add code icon

### Fixes

- Add route for user token path add and delete
- **function**: Ensure values of `false` and `0` (zero) do display
- **layout**: Add support for choices to be string type
- **routes**: Add default HydrationFallback
- **function**: field autolink is optional
- **layout**: dont raise exception and crash page render
- **layout**: use the back link instead of self for the form cancel button
- **hoook**: Remove double `//` from url when conducting apiFetch
- **function**: Ensure the actual key is fetched for building linked field
- **component**: Add ITOps Icon
- **layout**: Use meta return_url when posting a form
- **layout**: dont populate form field with initial value if field already has value within model form
- **layout**: dont populate form field with initial value if empty within model form

### Refactoring

- **hook**: Dont add trailing slant to url
- **component**: Update notes form field content -> body
- **component**: Update notes field content -> body
- **component**: Use URL path for active page detection for navigation
- **component**: Update comment type detection for comment form
- **component**: use url._self for detail Add link
- **component**: use url._self for detail edit link
- **layout**: use url._self for list data url

### Tests

- **function**: FormatTime dont use TZ that observe daylight savings

## 0.6.0 (2025-02-28)

### feat

- **node**: install jest as dev dep
- **node**: Setup jest testing
- **node**: update react 18.3.1 -> 19.0.0
- **component**: Automagic set light/dark mode if user sets auto
- **layour**: Populate initial value for textfield field on ModelForm
- **layour**: Populate initial value for textfield multi field on ModelForm
- **layour**: Populate initial value for datetime-local field on ModelForm
- **component**: Add support for an initial value for textfield
- **component**: Add User Menu for logged in users
- **component**: Initial Menu component
- Add Logout endpoint

### Fixes

- **component**: Add support for `-action_delete-` table column
- **layout**: On successful delete redirect
- **function**: REmove format option `M` due to attempts to format month letter
- **function**: Ensure if choice fields value is string it is populated
- **layout**: Ensure ModelForm does populate initial from meta if supplied
- **component**: don't render line breaks as they are designed to be collapsed
- **hook**: If no body is supplied for apifetch, dont attempt to fetch csrf token
- **hook**: dont attempt to fetch user data unless settings url is HTTP/200
- **function**: Correct maths for conviersion of seconds to h:m:s

### Refactoring

- **layout**: update history to use new path

### Tests

- **function**: FormatTime checks
- **function**: initial FormatTime tests

## 0.5.0 (2025-02-14)

### feat

- **layout**: Ticket metadata fields to fit width of bar
- **layout**: New Ticket form migrated from ModelForm -> Ticket
- **component**: Markdown Editor support for being part of existing form
- **component**: InlineField support for being part of existing form
- **component**: Form action `POST` returns redirect to `response._urls._self`
- **component**: Text field disabled added as option
- **function**: if `FieldData.data=null` dont process
- **component**: Select field disabled added as option
- **component**: Detect Browser mode from user settings
- **component**: Update to use new notes model
- **fuunction**: Markdown plugin code block copy buton
- **component**: Add Copy Icon
- **function**: Markdown Plugin HTML Tag Whitelist
- **component**: Add new component section
- **component**: fetch ALL paginated results for a tickets comments
- **layout**: Add priority badge field to ticket
- **layout**: Add impact badge field to ticket
- **layout**: Add urgency badge field to ticket

### Fixes

- Route for creating tickets must be dynamic
- **component**: Select field multiselect css psudo class input
- **component**: when linked items reach end of row, wrap
- **component**: Ensure the inline edit save button functions for markdown editing
- **layout**: ensure ticket metadata sidebar doesnt exceed max-width
- **component**: IF button id specified, use it
- **layout**: correct ticket layout/css issues
- **component**: Cater for ManyToOne field for inline form action
- **component**: select field default to null
- **component**: for tables if no meta exists dont attempt to access

### Refactoring

- **function**: add text to span element for ticket link
- **function**: add text to span element for model link
- **component**: remove line height from replated tickets
- **layout**: CSS Clean and alignment of items
- **layout**: Detail view updated to use section and to offer mobile support
- **layout**: ticket styles for mobile support
- **component**: Ticket linked items updated to use section and to offer mobile support
- **layout**: Ticket related tickets updated to use section and to offer mobile support
- **layout**: Ticket comment(s) updated to use section and to offer mobilke support
- **layout**: Adjust Ticket to use Section Component
- **component**: Adjust TicketComments to use Section Component
- **component**: move styles to components and begin to make more mobile friendly
- **component**: rejig the badge style so items are aligned

## 0.4.0 (2025-01-22)

### feat

- **function**: Convert DateTime to user specified Time Zone
- **layout**: Add date fields for tickets to ticket meta bar
- **layout**: Ticket Meta fields made inline editable
- **component**: Inline form field editor
- **component**: Add name attribute to select field
- **component**: Add ability to set button class
- **component**: Enable select to return fieldset or isolated select
- **component**: Add support for textarea ctrl-enter for submission
- **component**: hande button clicks in Markdown editor
- **layout**: Add inline editing of ticket description
- **component**: Add to textarea option to expand to fit content height
- **component**: Markdown editor
- **component**: Format inline codeblock to match div code block
- **component**: Format admonition success and failure
- **component**: Format md for clarity
- **component**: Add ability to use either name or button text for external link text
- **component**: Fetch ticket linked items metadata
- **function**: Improved error handling for markdown plugins for items that have no metadata
- **function**: Add model icon to rendered markdown model tags
- **function**: pass metadata.fields.x.render for markdown rendering
- **function**: Markdown-it plugin to render model tags

### Fixes

- **component**: Update page number within table page number field
- router improvement to decrease requests and reliance on memo
- **component**: If no ticket comments are returned, dont attempt to process them
- **component**: If no linked ticket items are returned, dont attempt to process them
- **component**: If no related tickets are returned, dont attempt to process them
- **component**: Ensure correct elements are disabled on markdown edit
- **layout**: Use correct object for ticket description edit
- **component**: Dynamically update related ticket id prior to rendering
- **function**: Reorder formatter so that seconds is before month
- **function**: correct tag typo in model link
- **layout**: use correct key for fetching documentation field if defined

### Refactoring

- **component**: Use Form for aditing ticket description
- **function**: field may return null, use function to check presence of key
- **component**: Enable text area to be within a fieldset or not
- **component**: Related Ticket field to use FiledData Component to render markdown
- **component**: Ticket Linked Item field to use FiledData Component to render markdown
- **component**: map markdown rendering model name within icon loader
- **function**: Add markdown rendering of ticket reference
- **function**: Add further checks to ensure correct tag is valid

## 0.3.0 (2025-01-01)

### feat

- **componentt**: On click or new line expand text area height to equal, min content height
- **componentt**: On making a ticket comment, reset the comment form
- **style**: Remove arrows from number fields
- **component**: Add Loaded gate to table
- **component**: Add onKeyUp event to text field
- **hook**: Dont consume the body object as part of the apiFetch
- **component**: Enable replying to comment
- **component**: Replicate currect footer icons
- **component**: add swagger docs icon
- **component**: add swagger docs icon
- **component**: add git icon
- **component**: add documentation icon
- **component**: Log error to console if table has no `table_fields`
- **component**: Add UI release details to the footer
- **component**: Add API release details to the footer
- **node**: upgrade 22.11.0 -> 23 (edge)
- **npm**: upgrade react-router 6.26.2 -> 7.0.1
- **component**: Add ticket type icons
- **function**: Support multi-select fields
- **layout**: ticket created successfuly navigatae to list view
- **layout**: if detail view url changes, ensure active tab is reset
- **layout**: modelform to use metadata.return_url
- **component**: Add creation date to ticket action comments
- **component**: Seperate action comment user and message

### Fixes

- **componentt**: Ensure field data is fetched for fields
- **component**: Make Table page number editable
- **function**: reorder date formating so month letters are not re-interprited
- **layout**: use `back` url not `return_url` if it exists
- **hook**: ensure status is returned from apiFetch
- **layout**: If field is `write_only=true` dont add it to form_data on ModelForm
- **component**: Add missing edit callback for discussion comment
- **component**: When editing a ticket comment always use self url as post url
- **layout**: hwen posting a form, post to `.url.self`
- **component**: Ensure single column markdown field has markdown css class added
- **layout**: use correct method for adding select field to ititial data
- **layout**: Use metadata return url when posting a form
- **docker**: ensure entrypoiont creates valid env file for UI again.....
- **docker**: ensure entrypoiont creates valid env fiel for UI
- **layout**: Support the API metadata `back` URL
- **hook**: ensure UI action words are removed from API reuqest URL
- Detail and Ticket routes require their own loader
- Add missing route for common_model edits
- Dont allow field overflow, wrap text
- **component**: Ticket comment category now uses correct key

### Refactoring

- **layout**: Use PageLoader for ListView
- **component**: Dont render table if the data required is missing
- **component**: For Table process apiFetch results on return
- set form field font size to match common text size
- Use the api self and return_url as provided within the metadata
- **hook**: apiFetch by default make a meta request and return an object of all requests and the response
- loader to use apiFetch hook
- **layout**: remove page_data dependency from details useEffect hooks
- **component**: remove is_loading state object from table
- adjust routing to use Layout and Route Prefixes
- change static path static -> assets

## 0.2.0 (2024-11-15)

### feat

- **component**: Add missing navbar icons
- **component**: Add ticket comment inline editing
- add add route for ticket
- **component**: Check for table data, if none report so
- Add route for common model that contains PK
- **layout**: Use the url's as provided by API for models
- **component**: Format a charfield as hyperlink is metadata has `autolink=true`
- **component**: Auto-Expand Text area to content height style
- **component**: Auto-Expand Text area to content height
- **component**: Correctly convert ISO8601 with TZ to display in browser local TZ
- **component**: Support Timezoned DateTime fields
- **function**: Add Delete mehod to urlBuilder
- **layout**: display non-field errors at the top of the form
- **layout**: Cater for multi-select values
- **component**: Add support for multi-select form field
- **layout**: Form field error, set to be no larger than field
- **layout**: On form field error, scroll to top of form
- Support Markdown field

### Fixes

- **layout**: ensure all metadata is loaded prior to rendering a ticket
- Add missing route for project task add
- correct logic for history route to work
- **hook**: dont allow fields to be set to `undefined` within urlBuilder
- **layout**: if field is dict, ensure initial data is correctly set to val of `.id`
- **layout**: within form handle JSON data correctly when an object
- **component**: dont attempt to access field in double column if it doesnt exist
- **layout**: Ensure that Markdown code blocks do wrap text

### Refactoring

- **component**: Pass field object directly to textarea
- **component**: Pass in the entire field meta and have the component figure out the values

## 0.1.0 (2024-11-10)

### feat

- **docker**: Ability to configure the API URL
- **build**: Build docker container for UI
- **function**: add urlBuilder function to cater for url standard
- **component**: Add 401 login redirect
- **layout**: Add settings layout
- **component**: Add card page component
- **layour**: Add documentation content header icon if url present
- **function**: Add support for nested fields
- **component**: Add class to nav down icon
- **component**: Add automagic collabsible row if detected
- **layout**: Add history layour
- **layout**: Add rendering of history icon for detail
- **layout**: Add ability to pass content header Icon from all layouts
- **component**: Add Icon history
- **layout**: Add ability to pass content header Icon
- **component**: Add Icon help
- **component**: Add Icon delete
- **component**: Pass icon name to icon to use as css class name for icon loader
- **component**: Add Ticket Icon Related
- **component**: Add Ticket Icon Related Blocks
- **component**: Add Ticket Icon Related Blocked
- **component**: Add ticket linked items
- **layout**: Add ticket creation details to header
- **component**: Add handler for button click
- **layout**: Set content heading to match ticket title
- **layout**: Addfield ticket number to metadata header
- **layout**: Add set colour of heading to match ticket colour
- **layout**: Add duration field to ticket
- **layout**: Add priority field to ticket
- **component**: Add comment reply/create form
- **component**: Add form button
- **ticket**: Add initial ticket comment form
- **function**: add support for badge fields that have no url
- **component**: Add icon ticket status testing
- **component**: Add icon ticket status solved
- **component**: Add icon ticket status pending
- **component**: Add icon ticket status new/draft
- **component**: Add icon ticket status invalid
- **component**: Add icon ticket status evaluation
- **component**: Add icon ticket status closed
- **component**: Add icon ticket status assigned planning
- **component**: Add icon ticket status assigned
- **component**: Add icon ticket status approvals
- **component**: Add icon ticket status Accepted
- **Layout**: Update so ticket layout works
- **function**: add icon field support
- **component**: Add icon inventory status warning
- **component**: Add icon inventory status unknown
- **component**: Add icon inventory status ok
- **component**: Add icon inventory status bad
- add submodel action
- **function**: add badge field support
- **component**: add style class support to badge
- **component**: Add action remove icon
- **component**: Add action install icon
- **component**: Add action add icon
- Add package nunjucks for jinja rendering
- **component**: add external links to details tab first section
- **component**: add background colour support to badge
- **component**: Add link icon
- **layout**: ModelForm support for adding child-model
- **component**: Add Support for initial field value
- **layout**: Add HTTP/DELETE support to ModelForm
- Adding of sub-models
- **component**: Dynamic edit button for section
- **component**: Dynamic add button for table
- **hooks**: Enable the posting of data for apiFetch
- **component**: Add onChange and value to text field
- **component**: Add onChange and value to textarea field
- **component**: Add onChange and value to slider field
- **component**: Add onChange and value to select field
- **component**: Add "add" button to table
- **function**: Add model form for add/edit
- **function**: Add model edit functionality
- **layout**: Add table layout to Detail Section
- **layout**: Add Single Column to Detail
- **component**: Add Single Column for layout
- **function**: Add full width option to rendered markdown field
- **function**: Add JSON field formatting to FieldData
- **component**: Add page number input field for manual page selection for table pagination
- **component**: Enable TextField to display naked field
- **component**: Functional Table pagination footer
- **component**: Table added as component
- **component**: Add icon to nav tabs
- **component**: Add navigation double left icon
- **hook**: Add apiFetch to collect data from api
- **function**: Add relationship field type to fieldData
- **hook**: Add getCookie to get a local session cookie by name
- **function**: Render Markdown text
- **function**: Django DRF auto field data
- **styles**: Initial stylesheet
- **layout**: Initial Create Page
- Add base routes with error handler
- **component**: Add badge button/icon
- **component**: Add ticket comment
- **layout**: Initial Ticket Page
- **component**: Add Icon Loader
- **component**: Add Ticket status Icon
- **component**: Add Ticket Icon notification
- **component**: Add Icon software
- **component**: Add Icon reply
- **component**: Add Icon organization
- **component**: Add Icon nav right
- **component**: Add Icon nav down
- **component**: Add Icon menu
- **component**: Add Icon itam
- **component**: Add Icon edit
- **component**: Add Icon device
- **component**: Add Icon assistance
- **component**: Add Icon Task
- **component**: Add field text
- **component**: Add form field text area
- **component**: Add form field slider
- **component**: Add form field select
- **layout**: Initial Error Page
- **component**: Add details layout navtabs
- **component**: Add page navbar
- **component**: Add page header
- **component**: Add page footer
- **component**: Add detail layout section and column
- **layout**: Add root layout
- **layout**: Add list layout
- **layout**: Add detail layout
- Add exception class

### Fixes

- **layout**: Dont show comments on tickets if no metadata exists
- **layout**: Add error handling to detail if metadata missing
- **style**: correct icon size for table expandable row
- **component**: Dont show collapsible field expander if there are no fields
- **layout**: On page_data change re-fetch metadata
- **hook**: dont return body during apiFetch if HTTP/204
- **hooks**: Always return the cookie value for getCookie
- **function**: Ensure for field data that relationship and serializer dont attempt to fetch object items when not an object
- **component**: Dont attempt to load table unless both data and meta available

### Refactoring

- move nav to urlBuilder
- **detail**: Only re-render when required
- tickets to load comments in separate component
- metadata path change `metadata.actions.<method>` -> `metadata.fields`
- Add metadata dynamic loading of method key
- **layout**: Model note form creation of forms
- **layout**: Add model note form and tab
- **layout**: Add conversion of ticket and comment duration
- **component**: Add Related tickets
- **component**: Linked items to be a markdown field
- **component**: add ID to fields
- **component**: add ID to textfield
- **layout**: Ticket comments so they work with DRF
- **layout**: Use field data to fetch status badge
- **layout**: migrate ticket comments request to django api
- **component**: Only show edit button on details tab of detail view
- **componend**: adjust anchor tags to Link component

## 0.0.1 (2024-09-27)
