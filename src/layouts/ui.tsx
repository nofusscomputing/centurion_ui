import {
    Outlet,
} from "react-router";

import {
    AlertGroup,
    Page,
    PageSidebar,
    PageSidebarBody,
} from "@patternfly/react-core";


import '../../node_modules/@patternfly/patternfly/components/Page/page.css'

import '../../node_modules/@patternfly/patternfly/patternfly.css'

import {
    useBackendProvider
} from "../App/providers/backend";

import Header from "../components/page/Header";
import {
    Notifications,
    useNotificationContext
} from "../components/NotificationDrawer";
import
    Navbar,
    {
        useNavbarContext,
} from "../components/page/Navbar";

import { UserProvider } from "../hooks/UserContext";



/**
 * This Layout provides the sites rendered layout. That is everything not common to the
 * {@link PageContent} layout.
 * 
 * @summary Site layout
 * 
 * @category Layout
 * @since 0.13.0
 */
const UI = (): React.JSX.Element => {

    const backend = useBackendProvider();

    const {
        navVariant,
        isSidebarOpen,
    } = useNavbarContext();

    const {
        alerts,
        isNotificationsOpen,
        maxDisplayed,
        overflowMessage,
        setAlerts,
        setNotificationsOpen,
    } = useNotificationContext();

    const onAlertGroupOverflowClick = () => {

        setAlerts([]);

        setNotificationsOpen(true);

    }


    return (
        <UserProvider>

            {alerts !== undefined && <AlertGroup
                hasAnimations
                isToast
                isLiveRegion
                overflowMessage={overflowMessage}
                onOverflowClick={onAlertGroupOverflowClick}
            >
                {alerts.slice(0, maxDisplayed)}
            </AlertGroup>}

            <Page
                isContentFilled
                isManagedSidebar
                isNotificationDrawerExpanded = {isNotificationsOpen}
                masthead = {<Header />}
                notificationDrawer = { setNotificationsOpen !== undefined ? <Notifications /> : null }
                sidebar = { navVariant == 'default' ?
                    <PageSidebar
                        id = "fill-sidebar"
                        isSidebarOpen = {isSidebarOpen}
                    >
                        <PageSidebarBody>
                            <Navbar />
                        </PageSidebarBody>
                    </PageSidebar>
                    : undefined
                }
            >

                {backend.rootMetadata && <Outlet />}

            </Page>

        </UserProvider>
    );

};



export default UI;
