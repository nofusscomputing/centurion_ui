import {
    createRef,
    useContext,
    useEffect
} from "react";

import {
    MemoryRouter
} from "react-router";

import {
    render,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import
    Views,
    {
        CardLayout,
        pageTabs,
        viewsContext,
        ViewsProvider,
        ViewsVariant
} from "../../Views";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";



describe('Views', () => {

    describe('sidebar', () => {

        const Layout = () => {

            const {
                pageContent, setPageContent,
                sidebarContent, setSidebarContent
            } = useContext(viewsContext);

            useEffect(() => {

                setPageContent(
                    <>
                    the page content.
                    </>
                );

                setSidebarContent(
                    <>
                    the sidebar content.
                    </>
                );

            },[]);

            return (
                <Views variant = {ViewsVariant.sidebar} />
            );
        };



        test('has page content', () => {

            const rendered = render(
                <ViewsProvider>
                    <Layout />
                </ViewsProvider>
            );


            expect(rendered.getByText(/the page content\./i)).toBeInTheDocument()
        });



        test('has sidebar content', () => {

            const rendered = render(
                <ViewsProvider>
                    <Layout />
                </ViewsProvider>
            );


            expect(rendered.getByText(/the sidebar content\./i)).toBeInTheDocument()
        });



        describe('Card Content', () => {

            describe('Layout - Column', () => {

                const Layout = () => {

                    const {
                        setIsCardContent, setCardLayout,
                        pageContent, setPageContent,
                        sidebarContent, setSidebarContent
                    } = useContext(viewsContext);

                    useEffect(() => {

                        setIsCardContent(true);

                        setCardLayout(CardLayout.column);

                        setPageContent(
                            <>
                                <Card>
                                    <CardTitle>Card #1</CardTitle>
                                    <CardBody>The card content 1</CardBody>
                                </Card>
                                <Card>
                                    <CardTitle>Card #2</CardTitle>
                                    <CardBody>The card content 2</CardBody>
                                </Card>
                                <Card>
                                    <CardTitle>Card #3</CardTitle>
                                    <CardBody>The card content 3</CardBody>
                                </Card>
                            </>
                        );

                        setSidebarContent(
                            <>
                            the sidebar content.
                            </>
                        );

                    },[]);

                    return (
                        <Views variant = {ViewsVariant.sidebar} />
                    );
                };



                test('is flex Column', () => {

                    const rendered = render(
                        <ViewsProvider>
                            <Layout />
                        </ViewsProvider>
                    );

                    const sidebar = rendered.container.querySelector('.pf-v6-c-sidebar__content')
                    const cardArea = sidebar.querySelector('.pf-v6-l-flex')

                    /**
                     * Ensure all three cards render.
                     */
                    expect(cardArea.textContent).toContain('Card #1')
                    expect(cardArea.textContent).toContain('Card #2')
                    expect(cardArea.textContent).toContain('Card #3')



                    expect(cardArea.className).toContain('pf-m-column')
                });



                test('Transparent Background', () => {

                    const rendered = render(
                        <ViewsProvider>
                            <Layout />
                        </ViewsProvider>
                    );

                    const sidebar = rendered.container.querySelector('.pf-v6-c-sidebar__content')
                    const cardArea = sidebar.querySelector('.pf-v6-l-flex')

                    /**
                     * Ensure all three cards render.
                     */
                    expect(cardArea.textContent).toContain('Card #1')
                    expect(cardArea.textContent).toContain('Card #2')
                    expect(cardArea.textContent).toContain('Card #3')



                    expect(cardArea.style.backgroundColor).toBe('transparent')
                });

            });



            describe('Layout - Gallery', () => {

                const Layout = () => {

                    const {
                        setIsCardContent, setCardLayout,
                        pageContent, setPageContent,
                        sidebarContent, setSidebarContent
                    } = useContext(viewsContext);

                    useEffect(() => {

                        setIsCardContent(true);

                        setCardLayout(CardLayout.grid);

                        setPageContent(
                            <>
                                <Card>
                                    <CardTitle>Card #1</CardTitle>
                                    <CardBody>The card content 1</CardBody>
                                </Card>
                                <Card>
                                    <CardTitle>Card #2</CardTitle>
                                    <CardBody>The card content 2</CardBody>
                                </Card>
                                <Card>
                                    <CardTitle>Card #3</CardTitle>
                                    <CardBody>The card content 3</CardBody>
                                </Card>
                            </>
                        );

                        setSidebarContent(
                            <>
                            the sidebar content.
                            </>
                        );

                    },[]);

                    return (
                        <Views variant = {ViewsVariant.sidebar} />
                    );
                };



                test('is Gallery', () => {

                    const rendered = render(
                        <ViewsProvider>
                            <Layout />
                        </ViewsProvider>
                    );

                    const sidebar = rendered.container.querySelector('.pf-v6-c-sidebar__content')
                    const cardArea = sidebar.querySelector('.pf-v6-l-gallery')

                    /**
                     * Ensure all three cards render.
                     */
                    expect(cardArea.textContent).toContain('Card #1')
                    expect(cardArea.textContent).toContain('Card #2')
                    expect(cardArea.textContent).toContain('Card #3')



                    expect(cardArea).not.toBeNull()
                });



                test('Transparent Background', () => {

                    const rendered = render(
                        <ViewsProvider>
                            <Layout />
                        </ViewsProvider>
                    );

                    const sidebar = rendered.container.querySelector('.pf-v6-c-sidebar__content')
                    const cardArea = sidebar.querySelector('.pf-v6-l-gallery')

                    /**
                     * Ensure all three cards render.
                     */
                    expect(cardArea.textContent).toContain('Card #1')
                    expect(cardArea.textContent).toContain('Card #2')
                    expect(cardArea.textContent).toContain('Card #3')



                    expect(cardArea.style.backgroundColor).toBe('transparent')
                });

            });

        });



        describe('Tabbed Content', () => {


            const Layout = ({
                nav = false
            }) => {

                const {
                    tabs, setTabs
                } = useContext(viewsContext);

                    const tabContent: Array<pageTabs> = Array.from({ length: 5 }, (_, index) => ({
                        name: `name-${index}`,
                        ...(nav ? {link: `link-${index}`} : {}),
                        ref: createRef(),
                        content: (<>content-{index}</>)
                    }));

                useEffect(() => {

                    setTabs(tabContent);

                },[]);

                let a = 'a'

                return (
                    <Views variant = {ViewsVariant.tabs} />
                );
            };



            describe('Tabs', () => {

                test('Available tabs render', () => {

                    const rendered = render(
                        <MemoryRouter>
                            <ViewsProvider>
                                <Layout nav  = {false} />
                            </ViewsProvider>
                        </MemoryRouter>
                    );

                    const tabsElement = rendered.container.querySelector('.pf-v6-c-tabs')
                    const tabsArea = tabsElement.querySelector('.pf-v6-c-tabs__list')

                    expect(tabsArea.textContent).toContain('name-0')
                    expect(tabsArea.textContent).toContain('name-1')
                    expect(tabsArea.textContent).toContain('name-2')
                    expect(tabsArea.textContent).toContain('name-3')
                    expect(tabsArea.textContent).toContain('name-4')

                });



                test('is not navigation', () => {

                    const rendered = render(
                        <MemoryRouter>
                            <ViewsProvider>
                                <Layout nav  = {false} />
                            </ViewsProvider>
                        </MemoryRouter>
                    );

                    const tabsElement = rendered.container.querySelector('.pf-v6-c-tabs');
                    const tabsArea = tabsElement.querySelector('.pf-v6-c-tabs__list');

                    const navElement = rendered.container.querySelector('nav');

                    /**
                     * All tabs must render
                     */
                    expect(tabsArea.textContent).toContain('name-0');
                    expect(tabsArea.textContent).toContain('name-1');
                    expect(tabsArea.textContent).toContain('name-2');
                    expect(tabsArea.textContent).toContain('name-3');
                    expect(tabsArea.textContent).toContain('name-4');

                    expect(navElement).toBeNull()

                });


    
                test('Tab is button', () => {

                    const rendered = render(
                        <MemoryRouter>
                            <ViewsProvider>
                                <Layout nav  = {false} />
                            </ViewsProvider>
                        </MemoryRouter>
                    );

                    const tabsElement = rendered.container.querySelector('.pf-v6-c-tabs')
                    const tabsArea = tabsElement.querySelector('.pf-v6-c-tabs__list')
                    const firstTab = tabsArea.firstChild.firstChild

                    /**
                     * First tab must render
                     */
                    expect(tabsArea.textContent).toContain('name-0')

                    expect(firstTab.tagName).toBe('BUTTON')

                });



                test('Default tab content renders', () => {

                    const rendered = render(
                        <MemoryRouter>
                            <ViewsProvider>
                                <Layout nav  = {false} />
                            </ViewsProvider>
                        </MemoryRouter>
                    );

                    const tabsElement = rendered.container.querySelector('.pf-v6-c-tab-content')

                    expect(tabsElement.textContent).toContain('content-0')
                });



                test("click on second tab renders it's content", async () => {

                    const rendered = render(
                        <MemoryRouter>
                            <ViewsProvider>
                                <Layout nav  = {false} />
                            </ViewsProvider>
                        </MemoryRouter>
                    );

                    const newActiveTab = rendered.getByText(/name-1/i)
                    const user = userEvent.setup();

                    await user.click(newActiveTab);

                    const tabsElement = rendered.container.querySelector('.pf-v6-c-tab-content')


                    expect(tabsElement.textContent).toContain('content-1')
                });



                describe('Navigable Tabs', () => {


                    test('is navigation', () => {

                        const rendered = render(
                            <MemoryRouter>
                                <ViewsProvider>
                                    <Layout nav  = {true} />
                                </ViewsProvider>
                            </MemoryRouter>
                        );

                        const tabsElement = rendered.container.querySelector('.pf-v6-c-tabs');
                        const tabsArea = tabsElement.querySelector('.pf-v6-c-tabs__list');

                        const navElement = rendered.container.querySelector('nav');

                        /**
                         * All tabs must render
                         */
                        expect(tabsArea.textContent).toContain('name-0');
                        expect(tabsArea.textContent).toContain('name-1');
                        expect(tabsArea.textContent).toContain('name-2');
                        expect(tabsArea.textContent).toContain('name-3');
                        expect(tabsArea.textContent).toContain('name-4');

                        expect(navElement).not.toBeNull()

                    });


        
                    test('Tab is anchor tag', () => {

                        const rendered = render(
                            <MemoryRouter>
                                <ViewsProvider>
                                    <Layout nav  = {true} />
                                </ViewsProvider>
                            </MemoryRouter>
                        );

                        const tabsElement = rendered.container.querySelector('.pf-v6-c-tabs')
                        const tabsArea = tabsElement.querySelector('.pf-v6-c-tabs__list')
                        const firstTab = tabsArea.firstChild.firstChild

                        /**
                         * First tab must render
                         */
                        expect(tabsArea.textContent).toContain('name-0')

                        expect(firstTab.tagName).toBe('A')

                    });

                });

            });



        });


    });

});
