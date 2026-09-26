import {
    Outlet
} from "react-router";

import {
    NotificationContextProvider
} from "../components/NotificationDrawer";



/**
 * This Layout provides the Notifications.
 * 
 * @summary Notification layout
 * 
 * @category Layout
 * @since 0.13.0
 */
const NotificationLayout = (): React.JSX.Element => {

    return (
            <NotificationContextProvider>

                <Outlet />

            </NotificationContextProvider>
    );

};



export default NotificationLayout;
