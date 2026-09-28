import {
    Outlet,
} from "react-router";

import {
    BackendProvider
} from "../App/providers/backend";

import {
    NavbarContextProvider
} from "../components/page/Navbar";



/**
 * This layout is intended to be the component on any route that contains
 * handle `backend_url`. This is so that every child layout can obtain the
 * correct backend details.
 * 
 * This layout also contains the {@link NavbarContextProvider}. This is so that
 * navigation can be setup per provider.
 * 
 * @summary Backend layout
 * 
 * @category Layout
 * @since 0.13.0
 */
const BackendLayout = (): React.JSX.Element => {

    return (
        <BackendProvider>
            <NavbarContextProvider>

                <Outlet />

            </NavbarContextProvider>
        </BackendProvider>
    );

};



export default BackendLayout;
