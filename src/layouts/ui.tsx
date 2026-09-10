import {
    Outlet,
} from "react-router";

import {
    AlertGroup,
    Page,
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
        NavbarContextProvider
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

                <NavbarContextProvider>

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
                        sidebar = {<Navbar
                            apiMetadata = {backend.rootMetadata}
                        />}
                    >

                        {backend.rootMetadata && <Outlet />}

                    </Page>

                </NavbarContextProvider>

        </UserProvider>
    );

};



export default UI;
