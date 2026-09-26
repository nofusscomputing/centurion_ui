import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState
} from 'react';

import {
    Link,
    useLocation,
} from "react-router";

import {
    Nav,
    NavExpandable,
    NavItem,
    NavList,
    NavProps,
    Skeleton
} from "@patternfly/react-core";

import IconLoader from '../IconLoader';

import {
    useBackendProvider
} from '../../App/providers/backend';



/**
 * 
 * @summary Navbar Context
 * 
 * @category Type
 * @since 0.13.0
 */
export type NavbarContext = {

    /**
     * Orientation of the navigation.
     */
    navVariant: NavProps['variant']

    setNavVariant: Dispatch<SetStateAction<NavProps['variant']>>

    /**
     * Current value of sidebar Open.
     */
    isSidebarOpen: boolean
    
    /**
     * Toggle the sidebar Open / Close.
     */
    onSidebarToggle: () => void
}



const navbarContext = createContext<NavbarContext>({
    navVariant: 'default',
    setNavVariant: undefined,
    isSidebarOpen: true,
    onSidebarToggle: undefined
});



/**
 * 
 * @summary Context provider for {@link Navbar}
 * 
 * @category Context
 * @since 0.13.0
 */
export const NavbarContextProvider = ({
    children
}): React.JSX.Element => {

    const [navVariant, setNavVariant] = useState<NavbarContext['navVariant']>('default');

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const onSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <navbarContext.Provider value={{
            navVariant: navVariant,
            setNavVariant: setNavVariant,
            isSidebarOpen: isSidebarOpen,
            onSidebarToggle: onSidebarToggle
        }}>
            {children}
        </navbarContext.Provider>
    );

}



/**
 * 
 * Renders the complete site navigation in a sidebar.
 * 
 * @summary Site Page Navigation
 * 
 * @category Component
 * @since 0.1.0 
 */
const Navbar = () => {

    const [ activeGroup, setActiveGroup ] = useState(null);

    const [ activeItem, setActiveItem ] = useState(null);

    const {
        navVariant,
        setNavVariant,
    } = useNavbarContext();

    const location = useLocation();

    const [ navigationEntries, setNavigationEntries ] = useState(null)

    const backend = useBackendProvider();

    useEffect(() => {

        if(backend.rootMetadata) {

            setNavigationEntries(backend.rootMetadata.navigation.menu);

            setNavVariant(backend.rootMetadata.navigation.variant || 'default');

        }

    }, [ backend.rootMetadata ]);



    useEffect(() => {

        if( navigationEntries ) {

            let index = 0;

            for(let menu of navigationEntries) {

                let page_index = 0;

                for(let page of menu.pages) {

                    if( String(location.pathname).startsWith( page.link ) ) {

                        const groupID = `navigation-${menu.name}-${index}`
                        const ItemID = `${groupID}_${page.name}-${page_index}`

                        setActiveGroup(groupID);
                        setActiveItem(ItemID);

                    }

                    page_index ++;
                }

                index ++;

            }
        }

    }, [
        location.pathname,
        navigationEntries,
    ])


    const onSelect = (_event, result) => {
        setActiveGroup(result.groupId);
        setActiveItem(result.itemId);
    };

    const onToggle = (_event, result) => {
        console.debug(`Group ${result.groupId} expanded? ${result.isExpanded}`);
    };


    return (
        <Nav
            aria-label = "Expandable global"
            onSelect = {onSelect}
            onToggle = {onToggle}
            variant = { navVariant }
        >
            <NavList>
                { ! navigationEntries && 
                        [...Array(7)].map((_, index) => {
                        return (
                            <Skeleton key = {index} />
                        )
                    })
                }
                { navigationEntries && navigationEntries.map((module, index) => {

                    const groupId = `navigation-${module.name}-${index}`

                    if( navVariant === 'horizontal' ) {

                        return(
                            <NavItem
                                component={(props) => <Link children={props.children.filter(v => v !== null && v !== undefined)} className={props.className} to={module.link}/>}
                                groupId={`navigation-${module.name}-${index}`}
                                icon={<IconLoader
                                    name = {'icon' in module ? String(module.icon) : String(module.name)}
                                    size = "lg"
                                />}
                                isActive={activeGroup === groupId}
                                id={`navigation-${module.name}-${index}`}
                            >
                                {module.display_name}
                            </NavItem>
                        );
                    }


                    return (
                        <NavExpandable
                            groupId={`navigation-${module.name}-${index}`}
                            isActive={activeGroup === groupId}
                            isExpanded={activeGroup === groupId}
                            icon={<IconLoader
                                name = {'icon' in module ? String(module.icon) : String(module.name)}
                                size = "lg"
                            />}
                            key={`navigation-${module.name}-${index}`}
                            title = {module.display_name}
                        >
                            {module.pages.map((page, page_index) => {

                                return (

                                    <NavItem
                                        id={`${groupId}_${page.name}`}
                                        groupId={groupId}
                                        itemId={`${groupId}_${page.name}-${page_index}`}
                                        key={`${groupId}_${page.name}-${page_index}`}
                                        isActive={activeItem === `${groupId}_${page.name}-${page_index}`}
                                        icon={
                                            <IconLoader
                                                id={`${groupId}_${page.name}`}
                                                name = {'icon' in page ? String(page.icon) : String(page.name)}
                                                size = "lg"
                                            />
                                        }
                                        component={(props) => <Link children={props.children.filter(v => v !== null && v !== undefined)} className={props.className} to={page.link}/>}
                                    >
                                        {page.display_name}
                                    </NavItem>
                                );
                            })}
                        </NavExpandable>
                    )
                })}
            </NavList>
        </Nav>
    );
}
 
export default Navbar;



/**
 * 
 * @summary Hook to use header context provider.
 * 
 * @category Hook
 * @since 0.13.0
 */
export function useNavbarContext(): NavbarContext {

    return useContext(navbarContext);

}
