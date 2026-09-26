import {
    createRoutesStub,
    Outlet
} from "react-router";

import {
    render
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
    NavbarContextProvider
} from "../../Navbar";

import PageContent from "../../../../layouts/PageContent";
import UI from "../../../../layouts/ui";

import {
    backendContext
} from "../../../../App/providers/backend";

import {
    NotificationContextProvider
} from "../../../NotificationDrawer";


jest.mock('../../../../components/IconLoader', () => {

    const IconLoader = ({
        fill = '#FFF',
        name = null,
        height = '40px',
        width = '40px',
        class_name = null,
        ...kwargs
    }) => {
        
        return (<></>)
    }


    return {
        __esModule: true,
        default: IconLoader,
    };
});



jest.mock('../../../../hooks/UserContext', () => {

    const React = require('react');

    const UserContext = React.createContext();

    const UserProvider = ({ children }) => {

        let contextData = {
            user: {},
            settings: {}
        };

        const demoRootPath = `${process.cwd()}/includes/usr/share/nginx/html/mock/api/v2`;

        try {

            const settingsRaw = require('fs').readFileSync(
                `${demoRootPath}/settings/user_settings/1/GET.json`,
                'utf-8'
            );

            const userRaw = require('fs').readFileSync(
                `${demoRootPath}/base/user/1/GET.json`,
                'utf-8'
            );

            contextData.settings = JSON.parse(settingsRaw);
            contextData.user = JSON.parse(userRaw);

        } catch (err) {
            // fallback already empty
        }

        return React.createElement(
            UserContext.Provider,
            { value: contextData },
            children
        );
    };


    return {
        __esModule: true,
        default: UserContext,
        UserProvider
    };

});



const fs = require('fs')
const path = require('path')



describe("Navbar", () => {

    const baseDir = path.join(__dirname, '../../../../../includes/usr/share/nginx/html/mock/api/v2')


    let consoleErrorSpy;

    const allowedErrors = [
    ];

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });


    const rootMetadataLoader = () => {

        const optionsFilePath = path.join(baseDir, 'OPTIONS.json')

        const rawOptions = fs.readFileSync(optionsFilePath, 'utf8')

        const jsonOptions = JSON.parse(rawOptions)


        return {
            page_data: null,
            metadata: jsonOptions
        }

    }

    const rootMetadata = rootMetadataLoader().metadata;

    const navMenuEntries = rootMetadata.navigation.menu.map((entry) => entry.display_name)

    const navMenuItems = rootMetadata.navigation.menu.map((entry) => {
        return {
            display_name: entry.display_name,
            pages: entry.pages.map((item) => item.display_name)
        };
    })


    describe("Variant", () => {


        describe('No Value', () => {

            test("Sidebar Toggle does exist", () => {

                const testMetadata = rootMetadata

                // variant key must not exist for test to function correctly.
                expect(Object.hasOwn(testMetadata.navigation, 'variant')).toBe(false)

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: testMetadata.urls.self,
                                        Component: () => { return (<></>)},
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: testMetadata,
                            url: testMetadata.urls.self
                        }}
                    >
                        <NavbarContextProvider>
                            <NotificationContextProvider>
                                <Stub initialEntries={[testMetadata.urls.self]} />
                            </NotificationContextProvider>
                        </NavbarContextProvider>
                    </backendContext.Provider>
                );

                const nav = rendered.baseElement.querySelector('button#fill-nav-toggle')

                expect(nav.className).toBe('pf-v6-c-button pf-m-plain pf-m-hamburger');

            })

            test('Sidebar Exists', () => {

                const testMetadata = rootMetadata

                // variant key must not exist for test to function correctly.
                expect(Object.hasOwn(testMetadata.navigation, 'variant')).toBe(false)

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: testMetadata.urls.self,
                                        Component: () => { return (<></>)},
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: testMetadata,
                            url: testMetadata.urls.self
                        }}
                    >
                        <NavbarContextProvider>
                            <NotificationContextProvider>
                                <Stub initialEntries={[testMetadata.urls.self]} />
                            </NotificationContextProvider>
                        </NavbarContextProvider>
                    </backendContext.Provider>
                );

                const nav = rendered.baseElement.querySelector('div.pf-v6-c-page__sidebar-main')

                expect(nav).not.toBe(null);

            })



            test('Navigation Exists', () => {

                const testMetadata = rootMetadata

                // variant key must not exist for test to function correctly.
                expect(Object.hasOwn(testMetadata.navigation, 'variant')).toBe(false)

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: testMetadata.urls.self,
                                        Component: () => { return (<></>)},
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: testMetadata,
                            url: testMetadata.urls.self
                        }}
                    >
                        <NavbarContextProvider>
                            <NotificationContextProvider>
                                <Stub initialEntries={[testMetadata.urls.self]} />
                            </NotificationContextProvider>
                        </NavbarContextProvider>
                    </backendContext.Provider>
                );

                const nav = rendered.baseElement.querySelector(
                    'div.pf-v6-c-page__sidebar-main'
                ).querySelector(
                    'nav'
                ).outerHTML

                expect(nav).not.toBe(null);

            })



            describe.each(navMenuItems)("Menu Entry $display_name", ({ display_name, pages }) => {


                test(`Menu Entry ${display_name} exists`, () => {

                    const testMetadata = rootMetadata

                    // variant key must not exist for test to function correctly.
                    expect(Object.hasOwn(testMetadata.navigation, 'variant')).toBe(false)

                    const Stub = createRoutesStub([
                        {
                            Component: UI,
                            children: [
                                {
                                    Component: PageContent,
                                    children: [
                                        {
                                            path: testMetadata.urls.self,
                                            Component: () => { return (<></>)},
                                        }
                                    ]
                                }
                            ],
                        }
                    ]);


                    const rendered = render(
                        <backendContext.Provider
                            value = {{
                                rootMetadata: testMetadata,
                                url: testMetadata.urls.self
                            }}
                        >
                            <NavbarContextProvider>
                                <NotificationContextProvider>
                                    <Stub initialEntries={[testMetadata.urls.self]} />
                                </NotificationContextProvider>
                            </NavbarContextProvider>
                        </backendContext.Provider>
                    );



                    const nav = rendered.baseElement.querySelector(
                        'div.pf-v6-c-page__sidebar-main'
                    ).querySelector(
                        'nav'
                    ).querySelector(
                        'ul.pf-v6-c-nav__list'
                    )

                    let entryExists = false;

                    nav.querySelectorAll('li.pf-v6-c-nav__item').forEach((item) => {
                        const button = item.querySelector(
                            'button'
                        );

                        if( button ) {


                            const value = Array.from(button.childNodes)
                                .filter((node) => node.nodeType === Node.TEXT_NODE)
                                .map((node) => node.textContent.trim())
                                .filter(Boolean)
                                .join(' ');

                            
                            if( value === display_name ) {
                                entryExists = true;
                                return;
                            };
                        }
                    })

                    expect(entryExists).toBe(true);

                })



                test.each(pages)(`Navigation item %s exists`,
                    async (page) => {

                    const user = userEvent.setup();

                    const testMetadata = rootMetadata

                    // variant key must not exist for test to function correctly.
                    expect(Object.hasOwn(testMetadata.navigation, 'variant')).toBe(false)

                    const Stub = createRoutesStub([
                        {
                            Component: UI,
                            children: [
                                {
                                    Component: PageContent,
                                    children: [
                                        {
                                            path: testMetadata.urls.self,
                                            Component: () => { return (<></>)},
                                        }
                                    ]
                                }
                            ],
                        }
                    ]);


                    const rendered = render(
                        <backendContext.Provider
                            value = {{
                                rootMetadata: testMetadata,
                                url: testMetadata.urls.self
                            }}
                        >
                            <NavbarContextProvider>
                                <NotificationContextProvider>
                                    <Stub initialEntries={[testMetadata.urls.self]} />
                                </NotificationContextProvider>
                            </NavbarContextProvider>
                        </backendContext.Provider>
                    );



                    const nav = rendered.baseElement.querySelector(
                        'div.pf-v6-c-page__sidebar-main'
                    ).querySelector(
                        'nav'
                    ).querySelector(
                        'ul.pf-v6-c-nav__list'
                    )

                    let entryExists = false;

                    for (const item of nav.querySelectorAll('li.pf-v6-c-nav__item')) {
                        const button = item.querySelector('button');

                        if (button) {
                            const value = Array.from(button.childNodes)
                                .filter((node) => node.nodeType === Node.TEXT_NODE)
                                .map((node) => node.textContent.trim())
                                .filter(Boolean)
                                .join(' ');

                            if (value === display_name) {
                                await user.click(button);

                                item.querySelectorAll('li.pf-v6-c-nav__item').forEach((item) => {
                                    const value = item.querySelector(
                                        'span.pf-v6-c-nav__link-text'
                                    ).textContent.trim();

                                    if( value === page ) entryExists = true;
                                })

                                break;
                            }
                        }
                    }

                    expect(entryExists).toBe(true);

                })

            });

        });



        describe('Value "default"', () => {

            test('Sidebar Exists', () => {

                const testMetadata = rootMetadata

                testMetadata.navigation.variant = 'default'

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: testMetadata.urls.self,
                                        Component: () => { return (<></>)},
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: testMetadata,
                            url: testMetadata.urls.self
                        }}
                    >
                        <NavbarContextProvider>
                            <NotificationContextProvider>
                                <Stub initialEntries={[testMetadata.urls.self]} />
                            </NotificationContextProvider>
                        </NavbarContextProvider>
                    </backendContext.Provider>
                );

                const nav = rendered.baseElement.querySelector('div.pf-v6-c-page__sidebar-main')

                expect(nav).not.toBe(null);

            })



            test('Navigation Exists', () => {

                const testMetadata = rootMetadata

                testMetadata.navigation.variant = 'default'

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: testMetadata.urls.self,
                                        Component: () => { return (<></>)},
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: testMetadata,
                            url: testMetadata.urls.self
                        }}
                    >
                        <NavbarContextProvider>
                            <NotificationContextProvider>
                                <Stub initialEntries={[testMetadata.urls.self]} />
                            </NotificationContextProvider>
                        </NavbarContextProvider>
                    </backendContext.Provider>
                );

                const nav = rendered.baseElement.querySelector(
                    'div.pf-v6-c-page__sidebar-main'
                ).querySelector(
                    'nav'
                ).outerHTML

                expect(nav).not.toBe(null);

            })



            describe.each(navMenuItems)("Menu Entry $display_name", ({ display_name, pages }) => {


                test(`Menu Entry ${display_name} exists`, () => {

                    const testMetadata = rootMetadata

                    testMetadata.navigation.variant = 'default'

                    const Stub = createRoutesStub([
                        {
                            Component: UI,
                            children: [
                                {
                                    Component: PageContent,
                                    children: [
                                        {
                                            path: testMetadata.urls.self,
                                            Component: () => { return (<></>)},
                                        }
                                    ]
                                }
                            ],
                        }
                    ]);


                    const rendered = render(
                        <backendContext.Provider
                            value = {{
                                rootMetadata: testMetadata,
                                url: testMetadata.urls.self
                            }}
                        >
                            <NavbarContextProvider>
                                <NotificationContextProvider>
                                    <Stub initialEntries={[testMetadata.urls.self]} />
                                </NotificationContextProvider>
                            </NavbarContextProvider>
                        </backendContext.Provider>
                    );



                    const nav = rendered.baseElement.querySelector(
                        'div.pf-v6-c-page__sidebar-main'
                    ).querySelector(
                        'nav'
                    ).querySelector(
                        'ul.pf-v6-c-nav__list'
                    )

                    let entryExists = false;

                    nav.querySelectorAll('li.pf-v6-c-nav__item').forEach((item) => {
                        const button = item.querySelector(
                            'button'
                        );

                        if( button ) {


                            const value = Array.from(button.childNodes)
                                .filter((node) => node.nodeType === Node.TEXT_NODE)
                                .map((node) => node.textContent.trim())
                                .filter(Boolean)
                                .join(' ');

                            
                            if( value === display_name ) {
                                entryExists = true;
                                return;
                            };
                        }
                    })

                    expect(entryExists).toBe(true);

                })



                test.each(pages)(`Navigation item %s exists`,
                    async (page) => {

                    const user = userEvent.setup();

                    const testMetadata = rootMetadata

                    testMetadata.navigation.variant = 'default'

                    const Stub = createRoutesStub([
                        {
                            Component: UI,
                            children: [
                                {
                                    Component: PageContent,
                                    children: [
                                        {
                                            path: testMetadata.urls.self,
                                            Component: () => { return (<></>)},
                                        }
                                    ]
                                }
                            ],
                        }
                    ]);


                    const rendered = render(
                        <backendContext.Provider
                            value = {{
                                rootMetadata: testMetadata,
                                url: testMetadata.urls.self
                            }}
                        >
                            <NavbarContextProvider>
                                <NotificationContextProvider>
                                    <Stub initialEntries={[testMetadata.urls.self]} />
                                </NotificationContextProvider>
                            </NavbarContextProvider>
                        </backendContext.Provider>
                    );



                    const nav = rendered.baseElement.querySelector(
                        'div.pf-v6-c-page__sidebar-main'
                    ).querySelector(
                        'nav'
                    ).querySelector(
                        'ul.pf-v6-c-nav__list'
                    )

                    let entryExists = false;

                    for (const item of nav.querySelectorAll('li.pf-v6-c-nav__item')) {
                        const button = item.querySelector('button');

                        if (button) {
                            const value = Array.from(button.childNodes)
                                .filter((node) => node.nodeType === Node.TEXT_NODE)
                                .map((node) => node.textContent.trim())
                                .filter(Boolean)
                                .join(' ');

                            if (value === display_name) {
                                await user.click(button);

                                item.querySelectorAll('li.pf-v6-c-nav__item').forEach((item) => {
                                    const value = item.querySelector(
                                        'span.pf-v6-c-nav__link-text'
                                    ).textContent.trim();

                                    if( value === page ) entryExists = true;
                                })

                                break;
                            }
                        }
                    }

                    expect(entryExists).toBe(true);

                })


                test.each(pages)('On click "%s" navigation occurs',
                    async (page) => {

                    const user = userEvent.setup();

                    const testMetadata = rootMetadata

                    testMetadata.navigation.variant = 'default'


                    const navMeta = testMetadata.navigation.menu
                        .find((entry) => entry.display_name === display_name)
                        .pages.find((pageMeta) => pageMeta.display_name === page)
                        .link;

                    const rootURL = String(navMeta).replace(
                        '/' + navMeta.split('/')[( navMeta.split('/').length - 1)], ''
                    )

                    const Stub = createRoutesStub([
                        {
                            Component: UI,
                            children: [
                                {
                                    Component: PageContent,
                                    children: [
                                        {
                                            path: rootURL,
                                            Component: () => { return (<Outlet />)},
                                            children: [
                                                {
                                                    path: navMeta,
                                                    Component: () => { return (<span id="test-navigated">Did Navigate</span>)},
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                        }
                    ]);


                    const rendered = render(
                        <backendContext.Provider
                            value = {{
                                rootMetadata: testMetadata,
                                url: testMetadata.urls.self
                            }}
                        >
                            <NavbarContextProvider>
                                <NotificationContextProvider>
                                    <Stub initialEntries={[rootURL]} />
                                </NotificationContextProvider>
                            </NavbarContextProvider>
                        </backendContext.Provider>
                    );



                    const nav = rendered.baseElement.querySelector(
                        'div.pf-v6-c-page__sidebar-main'
                    ).querySelector(
                        'nav'
                    ).querySelector(
                        'ul.pf-v6-c-nav__list'
                    )

                    let entryExists = false;

                    for (const item of nav.querySelectorAll('li.pf-v6-c-nav__item')) {
                        const button = item.querySelector('button');

                        if (button) {
                            const value = Array.from(button.childNodes)
                                .filter((node) => node.nodeType === Node.TEXT_NODE)
                                .map((node) => node.textContent.trim())
                                .filter(Boolean)
                                .join(' ');

                            if (value === display_name) {
                                await user.click(button);

                                for (const pageLink of nav.querySelectorAll('li.pf-v6-c-nav__item')) {

                                    const valuePage = pageLink.querySelector(
                                        'span.pf-v6-c-nav__link-text'
                                    ).textContent.trim();


                                    if( valuePage === page ) {
                                        entryExists = true

                                        const navLink = pageLink.querySelector('a.pf-v6-c-nav__link')

                                        await user.click(navLink)

                                        break
                                    };
                                }

                                if( entryExists ) break;
                            }
                        }
                    }

                    expect(
                        rendered.baseElement.querySelector('span#test-navigated').innerHTML
                    ).toBe('Did Navigate');

                })


            });

        });



        describe('Value "horizontal"', () => {


            test("Sidebar Toggle does not exist", () => {

                const testMetadata = rootMetadata

                testMetadata.navigation.variant = 'horizontal'

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: testMetadata.urls.self,
                                        Component: () => { return (<></>)},
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: testMetadata,
                            url: testMetadata.urls.self
                        }}
                    >
                        <NavbarContextProvider>
                            <NotificationContextProvider>
                                <Stub initialEntries={[testMetadata.urls.self]} />
                            </NotificationContextProvider>
                        </NavbarContextProvider>
                    </backendContext.Provider>
                );

                const nav = rendered.baseElement.querySelector('button#fill-nav-toggle')

                expect(nav).toBe(null);

            })



            test('Sidebar does not exist', () => {

                const testMetadata = rootMetadata

                testMetadata.navigation.variant = 'horizontal'

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: testMetadata.urls.self,
                                        Component: () => { return (<></>)},
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: testMetadata,
                            url: testMetadata.urls.self
                        }}
                    >
                        <NavbarContextProvider>
                            <NotificationContextProvider>
                                <Stub initialEntries={[testMetadata.urls.self]} />
                            </NotificationContextProvider>
                        </NavbarContextProvider>
                    </backendContext.Provider>
                );

                const nav = rendered.baseElement.querySelector('div.pf-v6-c-page__sidebar-main')

                expect(nav).toBe(null);

            })



            test('Navigation Exists', () => {

                const testMetadata = rootMetadata

                testMetadata.navigation.variant = 'horizontal'

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: testMetadata.urls.self,
                                        Component: () => { return (<></>)},
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: testMetadata,
                            url: testMetadata.urls.self
                        }}
                    >
                        <NavbarContextProvider>
                            <NotificationContextProvider>
                                <Stub initialEntries={[testMetadata.urls.self]} />
                            </NotificationContextProvider>
                        </NavbarContextProvider>
                    </backendContext.Provider>
                );

                const nav = rendered.baseElement.querySelector(
                    'div.pf-v6-c-masthead__content'
                ).querySelector(
                    'nav.pf-m-horizontal'
                ).outerHTML

                expect(nav).not.toBe(null);

            })



            test.each(navMenuEntries)('Menu Entry %s exists', (navEntry) => {

                const testMetadata = rootMetadata

                testMetadata.navigation.variant = 'horizontal'

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: testMetadata.urls.self,
                                        Component: () => { return (<></>)},
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: testMetadata,
                            url: testMetadata.urls.self
                        }}
                    >
                        <NavbarContextProvider>
                            <NotificationContextProvider>
                                <Stub initialEntries={[testMetadata.urls.self]} />
                            </NotificationContextProvider>
                        </NavbarContextProvider>
                    </backendContext.Provider>
                );



                const nav = rendered.baseElement.querySelector(
                    'div.pf-v6-c-masthead__content'
                ).querySelector(
                    'nav.pf-m-horizontal'
                ).querySelector(
                    'ul.pf-v6-c-nav__list'
                )

                let entryExists = false;

                nav.querySelectorAll('li.pf-v6-c-nav__item').forEach((item) => {
                    const value = item.querySelector(
                        'span.pf-v6-c-nav__link-text'
                    ).textContent.trim();

                    if( value === navEntry ) entryExists = true;
                })

                expect(entryExists).toBe(true);

            })



            test('On click navigation occurs', async () => {

                const user = userEvent.setup();

                const testMetadata = rootMetadata

                testMetadata.navigation.variant = 'horizontal'

                testMetadata.navigation.menu[0].link = `${testMetadata.urls.self}/another`

                let navOccured = false

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: testMetadata.urls.self,
                                        Component: () => { return (<Outlet />)},
                                        children: [
                                            {
                                                path: testMetadata.navigation.menu[0].link,
                                                Component: () => { navOccured = true; return (<span id="test-navigated">Did Navigate</span>)},
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: testMetadata,
                            url: testMetadata.urls.self
                        }}
                    >
                        <NavbarContextProvider>
                            <NotificationContextProvider>
                                <Stub initialEntries={[testMetadata.urls.self]} />
                            </NotificationContextProvider>
                        </NavbarContextProvider>
                    </backendContext.Provider>
                );

                const nav = rendered.baseElement.querySelector(
                    'div.pf-v6-c-masthead__content'
                ).querySelector(
                    'nav.pf-m-horizontal'
                )

                const navLink = nav.querySelector('li').querySelector('a.pf-v6-c-nav__link')

                await user.click(navLink)

                expect(
                    rendered.baseElement.querySelector('span#test-navigated').innerHTML
                ).toBe('Did Navigate');

            })

        });

    });



});
