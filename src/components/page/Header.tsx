import {
    Link,
} from "react-router";

import {
    Masthead,
    MastheadContent,
    MastheadMain,
    MastheadToggle,
    PageToggleButton,
    Title,
    Toolbar,
    ToolbarContent,
} from "@patternfly/react-core";

import HeaderToolbar from "./HeaderToolbar";
import {
    useNavbarContext
} from "./Navbar";

import '../../../node_modules/@patternfly/patternfly/components/Masthead/masthead.css'





/**
 * Props for the Header Component
 * 
 * @category Props
 * @expand
 * @since 0.1.0
 */
export type HeaderProps = {}



/** 
 * Site Header
 * 
 * Contains the Sites header bar that is rendered as part of every page.
 *
 * @category Component
 * @expandType HeaderProps
 * @since 0.1.0
 */
const Header = ({
}: HeaderProps): React.JSX.Element => {

    const { isSidebarOpen, onSidebarToggle } = useNavbarContext();


    return (
        <Masthead>
            <MastheadMain>
                <MastheadToggle>
                    <PageToggleButton
                        isHamburgerButton
                        aria-label="Global navigation"
                        isSidebarOpen={isSidebarOpen}
                        onSidebarToggle={onSidebarToggle}
                        id="fill-nav-toggle"
                    />
                </MastheadToggle>
                <Title headingLevel="h1" className="nfc-text-no-wrap">
                    <Link style={{textDecoration: "none"}} to='/'>Centurion ERP</Link>
                </Title>
            </MastheadMain>
            <MastheadContent>
                <Toolbar id="page-toolbar" isStatic>
                    <ToolbarContent>
                        <HeaderToolbar />
                    </ToolbarContent>
                </Toolbar>
            </MastheadContent>
        </Masthead>
    );
}


export default Header;
