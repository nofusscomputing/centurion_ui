import {
    useContext,
    useEffect,
    useState } from "react";

import {
    Link,
    useRevalidator
} from "react-router";

import {
    AlertVariant,
    Avatar,
    Button,
    ButtonVariant,
    Content,
    Divider,
    Dropdown,
    DropdownGroup,
    DropdownItem,
    DropdownList,
    MenuToggle,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalVariant,
    NotificationBadge,
    NotificationBadgeVariant,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem
} from "@patternfly/react-core";


import {
    CogIcon,
    EllipsisVIcon,
    HelpIcon,
    QuestionCircleIcon,
    RhUiRefreshIcon
} from '@patternfly/react-icons';

// @ts-expect-error TS[2307]
import imgAvatar from '@patternfly/react-core/src/components/assets/avatarImg.svg';



import UserContext from "../../hooks/UserContext";
import { useTheme, THEME_TYPES } from '../../hooks/useTheme';
import URLSanitize from "../../functions/URLSanitize";
import {
    useNotificationContext
} from "../NotificationDrawer";
import {
    useNotificationActions
} from "../../hooks/useNotificationActions";
import { useBackendProvider } from "../../App/providers/backend";
import IconLoader from "../IconLoader";



/** Header Toolbar
 *
 * 
 * @returns Useable Toolbar Ready to be placed in the page header.
 * 
 * @category Component
 * @since 0.9.0
 */
const HeaderToolbar = () => {


    const {
        alerts, setAlerts,
        alertTimeout,
        isNotificationsOpen, setNotificationsOpen,
        maxDisplayed,
        notifications, setNotifications,
        setOverflowMessage
    } = useNotificationContext();


    const { buildOverflowMessage, removeAllAlerts } = useNotificationActions();

    const user = useContext(UserContext)

    const [isKebabDropdownOpen, setIsKebabDropdownOpen] = useState(false);

    const [isFullKebabDropdownOpen, setIsFullKebabDropdownOpen] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { mode: themeMode, setMode: setThemeMode, modes: colorModes } = useTheme(THEME_TYPES.COLOR);

    const revalidator = useRevalidator();

    const backend = useBackendProvider();

    const onKebabDropdownSelect = () => {
        setIsKebabDropdownOpen(false);
    };

    const onFullKebabDropdownSelect = () => {
        setIsFullKebabDropdownOpen(false);
    };

    const onDropdownSelect = () => {
        setIsDropdownOpen(false);
    };


    const onKebabDropdownToggle = () => {
        setIsKebabDropdownOpen(!isKebabDropdownOpen);
    };

    const onFullKebabDropdownToggle = () => {
        setIsFullKebabDropdownOpen(!isFullKebabDropdownOpen);
    };

    const onDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    const onNotificationBadgeClick = () => {
        removeAllAlerts();
        setNotificationsOpen(!isNotificationsOpen)
    };

    const toggleModal = (_event: React.MouseEvent<Element, MouseEvent> | KeyboardEvent | MouseEvent) => {
        setIsModalOpen(!isModalOpen);
    };


    let totalUnreadNotifications = null;
    let notificationUnreadVariant = null;

    if( isNotificationsOpen !== undefined ) {

        totalUnreadNotifications = notifications.reduce(
            (total, n) => total + (!n.isNotificationRead ? 1 : 0),
            0
        );


        notificationUnreadVariant = notifications.reduce(
            (total, n) => total + ((n.variant === AlertVariant.danger && !n.isNotificationRead ) ? 1 : 0),
            0
        ) > 0 ? NotificationBadgeVariant.attention : NotificationBadgeVariant.unread;



        useEffect(() => {

            setOverflowMessage(buildOverflowMessage());

        }, [
            maxDisplayed,
            notifications,
            alerts
        ]);

    }


    useEffect(() => { // AutoMagic set based off of user preferences

        if( Number(user.settings.browser_mode) === 1 ) {    // auto

            setThemeMode(colorModes.SYSTEM);

        } else if( Number(user.settings.browser_mode) === 2 ) {    // Dark

                setThemeMode(colorModes.DARK);

        } else if( Number(user.settings.browser_mode) === 3 ) {    // Light

            setThemeMode(colorModes.LIGHT);

        }

    }, [
        user.settings.browser_mode,
    ])


    const KebabDropdownItems = () => {    // Mobile Menu
            return (
                <>
                    <DropdownItem icon = {<RhUiRefreshIcon />}>
                        <Link to="" onClick={ (e) => { e.preventDefault(); revalidator.revalidate() } }>Reload Content</Link>
                    </DropdownItem>
                    <DropdownItem icon = {<CogIcon />}>
                        <Link to={URLSanitize(user.settings._urls._self)}>
                            Settings
                        </Link>
                    </DropdownItem>
                    <DropdownItem
                        icon = {<HelpIcon />}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleModal(e)
                        }}
                    >
                            About
                    </DropdownItem>
                </>
            )
        };


    const UserDropdownItems = () => {

        return (
            <>
                <DropdownItem key="group 2 logout">
                    <Link to={'logout'}>Log out</Link>
                </DropdownItem>
            </>
        );
    }


    return (
        <>
        <Toolbar id="page-toolbar" isStatic>
            <ToolbarContent>
                <ToolbarGroup
                    variant="action-group-plain"
                    align={{
                        default: 'alignEnd'
                    }}
                    gap={{
                        default: 'gapNone',
                        md: 'gapMd'
                    }}
                >
                    <ToolbarGroup
                        variant="action-group-plain"
                        visibility={{
                            default: 'hidden',
                            lg: 'visible'
                        }}
                    >
                        <ToolbarItem>
                            <Button
                                aria-label="Settings"
                                // component={Link}
                                // // @ts-expect-error TS[2322]
                                //     to={"URLSanitize(user.settings._urls._self)"}
                                // isCircle
                                icon={<RhUiRefreshIcon />}
                                onClick={ () => revalidator.revalidate() }
                                title = "Reload Content"
                                variant="plain"
                            />
                        </ToolbarItem>
                        { isNotificationsOpen !== undefined && <NotificationBadge
                            count = {totalUnreadNotifications}
                            variant={totalUnreadNotifications === 0 ? NotificationBadgeVariant.read : notificationUnreadVariant}
                            onClick={onNotificationBadgeClick}
                            aria-label="Notifications"
                            isExpanded={isNotificationsOpen}
                        />}
                        <ToolbarItem>
                            {user.settings._urls &&
                            <Button
                                aria-label="Settings"
                                component={Link}
                                // @ts-expect-error TS[2322]
                                    to={URLSanitize(user.settings._urls._self)}
                                isSettings
                                variant="plain"
                            />}
                        </ToolbarItem>
                        <ToolbarItem>
                            <Button
                                aria-label="About"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleModal(e)
                                }}
                                variant={ButtonVariant.plain}
                                icon={<QuestionCircleIcon />}
                            />
                        </ToolbarItem>

                    </ToolbarGroup>
                    <ToolbarItem>
                        {/* <ThemeSelector id="ws-example-theme-select" /> */}
                    </ToolbarItem>
                    <ToolbarItem
                        visibility={{
                            default: 'hidden',
                            md: 'visible',
                            lg: 'hidden'
                        }}
                    >
                        <Dropdown
                            isOpen={isKebabDropdownOpen}
                            onSelect={onKebabDropdownSelect}
                            onOpenChange={isOpen => setIsKebabDropdownOpen(isOpen)}
                            popperProps={{
                                position: 'right'
                            }}
                            toggle={toggleRef => <MenuToggle
                                ref={toggleRef}
                                onClick={onKebabDropdownToggle}
                                isExpanded={isKebabDropdownOpen}
                                variant="plain"
                                aria-label="Settings and help"
                                icon={<EllipsisVIcon />}
                            />}
                        >
                        <DropdownList>{(user.settings._urls && user.user.display_name) && <KebabDropdownItems />}</DropdownList>
                        </Dropdown>
                    </ToolbarItem>
                    <ToolbarItem
                        visibility={{
                            md: 'hidden'
                        }}
                    >
                        <Dropdown
                            isOpen={isFullKebabDropdownOpen}
                            onSelect={onFullKebabDropdownSelect}
                            onOpenChange={isOpen => setIsFullKebabDropdownOpen(isOpen)}
                            popperProps={{
                                position: 'right'
                            }}
                            toggle={toggleRef => <MenuToggle
                                ref={toggleRef}
                                onClick={onFullKebabDropdownToggle}
                                isExpanded={isFullKebabDropdownOpen}
                                variant="plain"
                                aria-label="Toolbar menu"
                                icon={<EllipsisVIcon />}
                            />}
                        >

                            <DropdownList>
                                {(user.settings._urls && user.user.display_name) && <KebabDropdownItems />}
                            </DropdownList>

                            <Divider />

                            <DropdownGroup key="group 2" aria-label="User actions">
                                {(user.settings._urls && user.user.display_name) && <DropdownList><UserDropdownItems /></DropdownList>}
                            </DropdownGroup>

                        </Dropdown>
                    </ToolbarItem>
                </ToolbarGroup>
                <ToolbarItem visibility={{
                    default: 'hidden',
                    md: 'visible'
                }}>
                    <Dropdown
                        isOpen={isDropdownOpen}
                        onSelect={onDropdownSelect}
                        onOpenChange={isOpen => setIsDropdownOpen(isOpen)}
                        popperProps={{
                            position: 'right'
                        }}
                        toggle={toggleRef => <MenuToggle
                                ref={toggleRef}
                                onClick={onDropdownToggle}
                                isExpanded={isDropdownOpen}
                                icon={<Avatar src={imgAvatar} alt="" size="sm" />}
                            >
                                {user.user.display_name}
                            </MenuToggle>
                        }
                    >
                        {(user.settings._urls && user.user.display_name) && <DropdownList><UserDropdownItems /></DropdownList>}
                    </Dropdown>
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>

        <Modal
            isOpen={isModalOpen}
            variant={ModalVariant.medium}
            onClose={(e: React.MouseEvent<Element, MouseEvent> | KeyboardEvent | MouseEvent) => toggleModal(e)}
            ouiaId="AboutModal"
            aria-labelledby="basic-modal-title"
            aria-describedby="modal-box-body-basic"
        >
            <ModalHeader title="About Application" labelId="basic-modal-title" />

            <ModalBody id="modal-box-body-basic">

                <Content component="h3">
                    Backend
                </Content>

                <Content>
                    <dl>
                        <dt>Name</dt>
                        <dd>{backend.rootMetadata?.name ? backend.rootMetadata.name : "-" }</dd>
                        <dt>Version</dt>
                        <dd>{backend.rootMetadata?.version?.version ? backend.rootMetadata.version.version : "-" }</dd>
                        <dt>Commit</dt>
                        <dd>
                            { backend.rootMetadata?.version?.sha ?
                            <a href={backend.rootMetadata.version.project_url + '/commit/' + backend.rootMetadata.version.sha} target="_blank">
                                {backend.rootMetadata.version.sha}
                            </a> : "-" }
                        </dd>
                        <dt>Project</dt>
                        <dd>
                            {backend.rootMetadata?.version?.project_url ?
                                <a href={backend.rootMetadata.version.project_url} target="_blank">
                                {backend.rootMetadata.version.project_url}
                            </a> : "-" }
                        </dd>
                    </dl>
                    <Divider />
                </Content>

                <Content component="h3">
                    Frontend
                </Content>

                <Content>
                    <dl>
                        <dt>Name</dt>
                        <dd>Centurion UI</dd>
                        <dt>Version</dt>
                        <dd>{ window.api?.CI_COMMIT_TAG ?  window.api.CI_COMMIT_TAG : "-" }</dd>
                        <dt>Commit</dt>
                        <dd>
                            {window.api?.CI_COMMIT_SHA ? (
                                <a href={window.env.CI_PROJECT_URL + '/commit/' + window.env.CI_COMMIT_SHA} target="_blank">
                                    {window.env.CI_COMMIT_SHA}
                                </a>
                            ): "development" }
                        </dd>
                        <dt>Project</dt>
                        <dd>
                            { window.api?.CI_PROJECT_URL ? (
                                <a href={window.env.CI_PROJECT_URL} target="_blank">
                                    {window.api.CI_PROJECT_URL}
                                </a>
                            ) : "-" }
                        </dd>
                    </dl>
                </Content>
            </ModalBody>

            <ModalFooter>
                <Content>
                <a href="https://nofusscomputing.com/projects/centurion_erp/" target="_blank"><IconLoader size="xl" name = 'documentation' /></a>
                <a href={window.env.API_URL} target="_blank"><IconLoader name = 'webhook' size="xl"/></a>
                <a href={`${window.env.API_URL}/docs`} target="_blank"><IconLoader size="xl" name = 'swagger_docs' /></a>
                <a href="https://github.com/nofusscomputing/centurion_erp" target="_blank"><IconLoader name = 'git' size="xl" /></a>
                </Content>
            </ModalFooter>
        </Modal>
        </>
    );

};


export default HeaderToolbar;
