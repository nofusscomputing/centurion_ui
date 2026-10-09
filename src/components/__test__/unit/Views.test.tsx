import {
    useContext,
    useEffect
} from "react";

import {
    render
} from "@testing-library/react";

import
    Views,
    {
        CardLayout,
        viewsContext,
        ViewsProvider,
        ViewsVariant
} from "../../Views";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";



describe('Views', () => {

    describe('sidebar', () => {

        test('has page content', () => {

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


            const rendered = render(
                <ViewsProvider>
                    <Layout />
                </ViewsProvider>
            );


            expect(rendered.getByText(/the page content\./i)).toBeInTheDocument()
        });



        test('has sidebar content', () => {

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


            const rendered = render(
                <ViewsProvider>
                    <Layout />
                </ViewsProvider>
            );


            expect(rendered.getByText(/the sidebar content\./i)).toBeInTheDocument()
        });



        describe('Card Content', () => {

            describe('Layout - Column', () => {

                test('is flex Column', () => {

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

                test('is Gallery', () => {

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

                    const Layout = () => {

                        const {
                            setIsCardContent, setCardLayout,
                            pageContent, setPageContent,
                            sidebarContent, setSidebarContent
                        } = useContext(viewsContext);

                        useEffect(() => {

                            setIsCardContent(true);

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


    });

});
