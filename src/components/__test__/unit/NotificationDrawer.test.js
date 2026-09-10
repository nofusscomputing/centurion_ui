import React from "react";

jest.mock('../../../components/IconLoader', () => {

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



jest.mock('../../../hooks/UserContext', () => {

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


import { useContext, useEffect, useRef, useState } from "react";

import {
    render,
    screen,
    waitFor,
} from "@testing-library/react"

import {
    createRoutesStub,
    MemoryRouter,
} from 'react-router'


import { notificationContext, NotificationContextProvider, useNotificationContext } from "../../NotificationDrawer";
import Header from "../../page/Header";
import { UserProvider } from "../../../hooks/UserContext";
import { useNotificationActions } from "../../../hooks/useNotificationActions";
import { AlertVariant } from "@patternfly/react-core";
import UI from "../../../layouts/ui";
import userEvent from "@testing-library/user-event";
import NotificationLayout from "../../../layouts/Notifications";
import PageContent from "../../../layouts/PageContent";
import { NavbarContextProvider } from "../../page/Navbar";
import { backendContext } from "../../../App/providers/backend";


const fs = require('fs')
const path = require('path')


describe("NotificationDrawer", () => {

    const baseDir = path.join(__dirname, '../../../../includes/usr/share/nginx/html/mock/api/v2')


    let consoleErrorSpy;

    const allowedErrors = {
        'has_action_menu': "Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true."
    };
    let errors = [];

    beforeEach(() => {
        // consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
            // errors.push({
            //     args,
            //     stack: new Error().stack,
            // });
        });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        errors = []
    });



    const listBaseDir = path.join(baseDir, '/layout')

    const listIds = fs.readdirSync(listBaseDir)

    const listLayout = listIds
        .filter(viewName => [ 'table' ].includes(viewName))
        .map(viewName => {
        

        const filePath = path.join(listBaseDir, viewName, 'GET.json')

        const raw = fs.readFileSync(filePath, 'utf8')

        const json = JSON.parse(raw)

        const optionsFilePath = path.join(listBaseDir, viewName, 'OPTIONS.json')

        const rawOptions = fs.readFileSync(optionsFilePath, 'utf8')

        const jsonOptions = JSON.parse(rawOptions)


        return {
            data: json,
            options: jsonOptions
        }

    })

    const {data: objectData, options: objectMetadata } = listLayout[0]

    const unreadNotification = {
        title: "a title",
        srTitle: "another",
        variant: AlertVariant.info,
        key: "rand-key",
        timestamp: "a timestamp",
        description: "a description",
        isNotificationRead: false
    };


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


    test("Has action menu", async () => {


        const loader = async () => {

            return {
                page_data: objectData,
                metadata: objectMetadata
            };
        }


        const InnerComponent = () => {

            const {
                alerts, setAlerts,
                alertTimeout,
                drawerRef,
                isNotificationsOpen, setNotificationsOpen,
                maxDisplayed,
                overflowMessage,
                notifications, setNotifications,
                setOverflowMessage
            } = useNotificationContext();

            useEffect(() => {

                setNotifications([ unreadNotification ])

                setNotificationsOpen(true)

            }, []);

            return (<span>text {isNotificationsOpen}</span>);
        };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

        const rendered = render(
            <backendContext.Provider
                value = {{
                    rootMetadata: rootMetadata,
                    url: 'url'
                }}
            >
                <NotificationContextProvider>
                    <Stub initialEntries={[objectMetadata.urls.self]} />
                </NotificationContextProvider>
            </backendContext.Provider>
        );

        await waitFor(() => {

            const notifications = rendered.baseElement.querySelector(
                'div.pf-v6-c-notification-drawer__header'
            );

            expect(notifications).not.toBeNull();

        });


        const notifications = rendered.baseElement.querySelector('div[class="pf-v6-c-notification-drawer__header"]');

        const actionButton = notifications.querySelector('button[class="pf-v6-c-menu-toggle pf-m-plain"]')

        expect(actionButton).not.toBe(null)

        // No errors are to be thrown
        if( allowedErrors['has_action_menu'] == consoleErrorSpy.mock.calls[0][0] ) {
            /**
             * To Do: FixMe
             * Upstream:
             *      Bug: https://github.com/patternfly/patternfly-react/issues/12295
             *      PR: https://github.com/patternfly/patternfly-react/pull/12315
             * 
             * There is a bug in PatternFly when used with react 19. in my case
             * the file in question was `/home/sysadmin/git/centurion-erp-ui/node_modules/@patternfly/react-core/dist/js/components/Drawer/DrawerPanelContent.js`
             * 
             * Issue presented itself when updating to `@patternfly/react-core@6.5.1`
             * version `6.4.0` didn't have the issue
             */

            expect(true);

        } else {

            expect(consoleErrorSpy).not.toHaveBeenCalled();

        }


    });


    describe("Action Menu", () => {


        test("'Mark all as read' updates message format as read", async () => {


            const loader = async () => {

                return {
                    page_data: objectData,
                    metadata: objectMetadata
                };
            }


            const InnerComponent = () => {

                const {
                    alerts, setAlerts,
                    alertTimeout,
                    drawerRef,
                    isNotificationsOpen, setNotificationsOpen,
                    maxDisplayed,
                    notifications, setNotifications,
                    setOverflowMessage
                } = useNotificationContext();

                useEffect(() => {

                    setNotifications([ unreadNotification ])

                    setNotificationsOpen(true)

                }, []);

                return (<span>text {isNotificationsOpen}</span>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'div.pf-v6-c-notification-drawer__header'
                );

                expect(notifications).not.toBeNull();

            });

            const notificationDrawerHeader = rendered.baseElement.querySelector('div[class="pf-v6-c-notification-drawer__header"]');

            const notifications = rendered.baseElement.querySelector('ul[class="pf-v6-c-notification-drawer__list"]');

            const actionButton = notificationDrawerHeader.querySelector('button[class="pf-v6-c-menu-toggle pf-m-plain"]')

            const user = userEvent.setup();

            await user.click(actionButton);


            const readButton = screen.getByText(/Mark all read/i);

            await user.click(readButton);


            const notification = await notifications.querySelector('li');


            expect(notification).toHaveClass('pf-m-read')


            // No errors are to be thrown
            expect(consoleErrorSpy).not.toHaveBeenCalled();


        });


        test("'Clear all' Removes all notifications", async () => {


            const loader = async () => {

                return {
                    page_data: objectData,
                    metadata: objectMetadata
                };
            }


            const InnerComponent = () => {

                const {
                    alerts, setAlerts,
                    alertTimeout,
                    drawerRef,
                    isNotificationsOpen, setNotificationsOpen,
                    maxDisplayed,
                    notifications, setNotifications,
                    setOverflowMessage
                } = useNotificationContext();

                useEffect(() => {

                    setNotifications([ unreadNotification ])

                    setNotificationsOpen(true)

                }, [isNotificationsOpen]);

                return (<span>text {isNotificationsOpen}</span>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'div.pf-v6-c-notification-drawer__header'
                );

                expect(notifications).not.toBeNull();

            });

            const notificationDrawerHeader = rendered.baseElement.querySelector('div[class="pf-v6-c-notification-drawer__header"]');

            // const notifications = rendered.baseElement.querySelector('ul[class="pf-v6-c-notification-drawer__list"]');

            const actionButton = notificationDrawerHeader.querySelector('button[class="pf-v6-c-menu-toggle pf-m-plain"]')

            const user = userEvent.setup();

            await user.click(actionButton);


            const clearButton = screen.getByText(/Clear all/i);

            await user.click(clearButton);


            const clearedNotifications = await rendered.baseElement.querySelector('ul[class="pf-v6-c-notification-drawer__list"]');


            expect(clearedNotifications).toBe(null);


            // No errors are to be thrown
            expect(consoleErrorSpy).not.toHaveBeenCalled();


        });

    });

    describe("Notification", () => {


        describe("Action Menu", () => {

            test("'Clear' removes the message", async () => {


                const loader = async () => {

                    return {
                        page_data: objectData,
                        metadata: objectMetadata
                    };
                }


                const InnerComponent = () => {

                    const {
                        alerts, setAlerts,
                        alertTimeout,
                        drawerRef,
                        isNotificationsOpen, setNotificationsOpen,
                        maxDisplayed,
                        notifications, setNotifications,
                        setOverflowMessage
                    } = useNotificationContext();

                    useEffect(() => {

                        setNotifications([ unreadNotification ])

                        setNotificationsOpen(true)

                    }, [isNotificationsOpen]);

                    return (<span>text {isNotificationsOpen}</span>);
                };


                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: objectMetadata.urls.self,
                                        Component: InnerComponent,
                                    }
                                ]
                            }
                        ]
                    }
                ]);

                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: rootMetadata,
                            url: 'url'
                        }}
                    >
                        <NotificationContextProvider>
                            <Stub initialEntries={[objectMetadata.urls.self]} />
                        </NotificationContextProvider>
                    </backendContext.Provider>
                );

                await waitFor(() => {

                    const notifications = rendered.baseElement.querySelector(
                        'div.pf-v6-c-notification-drawer__header'
                    );

                    expect(notifications).not.toBeNull();

                });


                const notifications = rendered.baseElement.querySelector('ul[class="pf-v6-c-notification-drawer__list"]');

                const notification = notifications.querySelector('li');

                const notificationActions = notifications.querySelector('div[class="pf-v6-c-notification-drawer__list-item-action"]');

                const actionButton = notificationActions.querySelector('button[class="pf-v6-c-menu-toggle pf-m-plain"]')


                const user = userEvent.setup();

                await user.click(actionButton);


                const readButton = screen.getByText(/Clear/i)

                await user.click(readButton);

                const clearedNotifications = await rendered.baseElement.querySelector('ul[class="pf-v6-c-notification-drawer__list"]');


                expect(clearedNotifications).toBe(null)

                // No errors are to be thrown
                expect(consoleErrorSpy).not.toHaveBeenCalled();


            });


            test("'Mark as Read' updates message formatting as read", async () => {


                const loader = async () => {

                    return {
                        page_data: objectData,
                        metadata: objectMetadata
                    };
                }


                const InnerComponent = () => {

                    const {
                        alerts, setAlerts,
                        alertTimeout,
                        drawerRef,
                        isNotificationsOpen, setNotificationsOpen,
                        maxDisplayed,
                        notifications, setNotifications,
                        setOverflowMessage
                    } = useNotificationContext();

                    useEffect(() => {

                        setNotifications([ unreadNotification ])

                        setNotificationsOpen(true)

                    }, [isNotificationsOpen]);

                    return (<span>text {isNotificationsOpen}</span>);
                };


                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: objectMetadata.urls.self,
                                        Component: InnerComponent,
                                    }
                                ]
                            }
                        ]
                    }
                ]);

                const rendered = render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: rootMetadata,
                            url: 'url'
                        }}
                    >
                        <NotificationContextProvider>
                            <Stub initialEntries={[objectMetadata.urls.self]} />
                        </NotificationContextProvider>
                    </backendContext.Provider>
                );

                await waitFor(() => {

                    const notifications = rendered.baseElement.querySelector(
                        'div.pf-v6-c-notification-drawer__header'
                    );

                    expect(notifications).not.toBeNull();

                });


                const notifications = rendered.baseElement.querySelector('ul[class="pf-v6-c-notification-drawer__list"]');

                const notification = notifications.querySelector('li');

                const notificationActions = notifications.querySelector('div[class="pf-v6-c-notification-drawer__list-item-action"]');

                const actionButton = notificationActions.querySelector('button[class="pf-v6-c-menu-toggle pf-m-plain"]')


                const user = userEvent.setup();

                await user.click(actionButton);


                const readButton = screen.getByText(/Mark as read/i)

                await user.click(readButton);


                expect(notification).toHaveClass('pf-m-read')


                // No errors are to be thrown
                expect(consoleErrorSpy).not.toHaveBeenCalled();


            });

        });


        test("Has action menu", async () => {


            const loader = async () => {

                return {
                    page_data: objectData,
                    metadata: objectMetadata
                };
            }


            const InnerComponent = () => {

                const {
                    alerts, setAlerts,
                    alertTimeout,
                    drawerRef,
                    isNotificationsOpen, setNotificationsOpen,
                    maxDisplayed,
                    notifications, setNotifications,
                    setOverflowMessage
                } = useNotificationContext();

                useEffect(() => {

                    setNotifications([ unreadNotification ])

                    setNotificationsOpen(true)

                }, [isNotificationsOpen]);

                return (<span>text {isNotificationsOpen}</span>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'div.pf-v6-c-notification-drawer__header'
                );

                expect(notifications).not.toBeNull();

            });

            const notifications = rendered.baseElement.querySelector('ul[class="pf-v6-c-notification-drawer__list"]');

            const notification = notifications.querySelector('li');

            const notificationActions = notifications.querySelector('div[class="pf-v6-c-notification-drawer__list-item-action"]');

            const actionButton = notificationActions.querySelector('button[class="pf-v6-c-menu-toggle pf-m-plain"]')

            expect(actionButton).not.toBe(null)


            // No errors are to be thrown
            expect(consoleErrorSpy).not.toHaveBeenCalled();


        });


        test("Has a title", async () => {


            const loader = async () => {

                return {
                    page_data: objectData,
                    metadata: objectMetadata
                };
            }


            const InnerComponent = () => {

                const {
                    alerts, setAlerts,
                    alertTimeout,
                    drawerRef,
                    isNotificationsOpen, setNotificationsOpen,
                    maxDisplayed,
                    notifications, setNotifications,
                    setOverflowMessage
                } = useNotificationContext();

                useEffect(() => {

                    setNotifications([ unreadNotification ])

                    setNotificationsOpen(true)

                }, [isNotificationsOpen]);

                return (<span>text {isNotificationsOpen}</span>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'div.pf-v6-c-notification-drawer__header'
                );

                expect(notifications).not.toBeNull();

            });

            const notifications = rendered.baseElement.querySelector('ul[class="pf-v6-c-notification-drawer__list"]');

            const notification = notifications.querySelector('li[class="pf-v6-c-notification-drawer__list-item pf-m-hoverable pf-m-info"]');

            expect(
                screen.getByText(new RegExp(unreadNotification.title, "i"))
            ).toBeInTheDocument();


            // No errors are to be thrown
            expect(consoleErrorSpy).not.toHaveBeenCalled();


        });


        test("Has a description", async () => {


            const loader = async () => {

                return {
                    page_data: objectData,
                    metadata: objectMetadata
                };
            }


            const InnerComponent = () => {

                const {
                    alerts, setAlerts,
                    alertTimeout,
                    drawerRef,
                    isNotificationsOpen, setNotificationsOpen,
                    maxDisplayed,
                    notifications, setNotifications,
                    setOverflowMessage
                } = useNotificationContext();

                useEffect(() => {

                    setNotifications([ unreadNotification ])

                    setNotificationsOpen(true)

                }, [isNotificationsOpen]);

                return (<span>text {isNotificationsOpen}</span>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'div.pf-v6-c-notification-drawer__header'
                );

                expect(notifications).not.toBeNull();

            });

            const notifications = rendered.baseElement.querySelector('ul[class="pf-v6-c-notification-drawer__list"]');

            const notification = notifications.querySelector('li[class="pf-v6-c-notification-drawer__list-item pf-m-hoverable pf-m-info"]');

            expect(
                screen.getByText(new RegExp(unreadNotification.description, "i"))
            ).toBeInTheDocument();


            // No errors are to be thrown
            expect(consoleErrorSpy).not.toHaveBeenCalled();


        });


        test("Has a date-time", async () => {


            const loader = async () => {

                return {
                    page_data: objectData,
                    metadata: objectMetadata
                };
            }


            const InnerComponent = () => {

                const {
                    alerts, setAlerts,
                    alertTimeout,
                    drawerRef,
                    isNotificationsOpen, setNotificationsOpen,
                    maxDisplayed,
                    notifications, setNotifications,
                    setOverflowMessage
                } = useNotificationContext();

                useEffect(() => {

                    setNotifications([ unreadNotification ])

                    setNotificationsOpen(true)

                }, [isNotificationsOpen]);

                return (<span>text {isNotificationsOpen}</span>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'div.pf-v6-c-notification-drawer__header'
                );

                expect(notifications).not.toBeNull();

            });

            const notifications = rendered.baseElement.querySelector('ul[class="pf-v6-c-notification-drawer__list"]');

            const notification = notifications.querySelector('li[class="pf-v6-c-notification-drawer__list-item pf-m-hoverable pf-m-info"]');

            expect(
                screen.getByText(new RegExp(unreadNotification.timestamp, "i"))
            ).toBeInTheDocument();


            // No errors are to be thrown
            expect(consoleErrorSpy).not.toHaveBeenCalled();

        });


    });


    describe("Root Layout", () => {


        test("Contains Alert Toast", async () => {


            const loader = async () => {

                return {
                    page_data: objectData,
                    metadata: objectMetadata
                };
            }


            const InnerComponent = () => {

                return (<></>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'ul[class="pf-v6-c-alert-group pf-m-toast"]'
                );

                expect(notifications).not.toBeNull();

            });


            const htmlElement = rendered.baseElement.querySelector('ul[class="pf-v6-c-alert-group pf-m-toast"]');


            expect(htmlElement).not.toBe(null);


            // No errors are to be thrown
            if( allowedErrors['has_action_menu'] == consoleErrorSpy.mock.calls[0]?.[0] ) {
                /**
                 * To Do: FixMe
                 * Upstream:
                 *      Bug: https://github.com/patternfly/patternfly-react/issues/12295
                 *      PR: https://github.com/patternfly/patternfly-react/pull/12315
                 * 
                 * There is a bug in PatternFly when used with react 19. in my case
                 * the file in question was `/home/sysadmin/git/centurion-erp-ui/node_modules/@patternfly/react-core/dist/js/components/Drawer/DrawerPanelContent.js`
                 * 
                 * Issue presented itself when updating to `@patternfly/react-core@6.5.1`
                 * version `6.4.0` didn't have the issue
                 */

                expect(true);

            } else {

                expect(consoleErrorSpy).not.toHaveBeenCalled();

            }


        });


        test("Contains Notification Drawer", async () => {


            const loader = async () => {

                return {
                    page_data: objectData,
                    metadata: objectMetadata
                };
            }


            const InnerComponent = () => {

                const {
                        alerts, setAlerts,
                        alertTimeout,
                        isNotificationsOpen, setNotificationsOpen,
                        setNotifications,
                        maxDisplayed
                    } = useNotificationContext();

                useEffect(() => {

                    setNotificationsOpen(true)

                }, []);

                return (<span>{isNotificationsOpen}</span>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'div.pf-v6-c-notification-drawer__header'
                );

                expect(notifications).not.toBeNull();

            });


            const htmlElement = rendered.baseElement.querySelector('div[id="notifications-drawer"]');


            expect(htmlElement).not.toBe(null);


            // No errors are to be thrown
            expect(consoleErrorSpy).not.toHaveBeenCalled();

        });


    });


    describe("Notification Badge", () => {


        test("Unread notifications badge indicator colour 'unread'", async () => {


            const InnerComponent = () => {

                const { setNotifications } = useNotificationContext()

                useEffect(() => {

                    setNotifications([unreadNotification])

                }, []);
                

                return (<></>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            // Component: PageContent,
                            // children: [
                            //     {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                            //     }
                            // ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'button[aria-label="Notifications"]'
                );

                expect(notifications).not.toBeNull();

            });


            const htmlElement = rendered.container.querySelector('button[aria-label="Notifications"]');

            expect(String(htmlElement.classList).includes('pf-m-unread')).toBe(true);


            // No errors are to be thrown
            if( allowedErrors['has_action_menu'] == consoleErrorSpy.mock.calls?.[0]?.[0] ) {
                /**
                 * To Do: FixMe
                 * Upstream:
                 *      Bug: https://github.com/patternfly/patternfly-react/issues/12295
                 *      PR: https://github.com/patternfly/patternfly-react/pull/12315
                 * 
                 * There is a bug in PatternFly when used with react 19. in my case
                 * the file in question was `/home/sysadmin/git/centurion-erp-ui/node_modules/@patternfly/react-core/dist/js/components/Drawer/DrawerPanelContent.js`
                 * 
                 * Issue presented itself when updating to `@patternfly/react-core@6.5.1`
                 * version `6.4.0` didn't have the issue
                 */

                expect(true);

            } else {

                expect(consoleErrorSpy).not.toHaveBeenCalled();

            }

        });


        test("Unread notifications badge indicator colour 'alert'", async () => {


            const InnerComponent = () => {

                const { setNotifications } = useNotificationContext()

                const alertNotification = {
                    ...unreadNotification,
                    variant: AlertVariant.danger
                }

                useEffect(() => {

                    setNotifications([alertNotification])

                }, []);
                

                return (<></>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'button[aria-label="Notifications"]'
                );

                expect(notifications).not.toBeNull();

            });


            const htmlElement = rendered.container.querySelector('button[aria-label="Notifications"]');

            expect(String(htmlElement.classList).includes('pf-m-attention')).toBe(true);


            // No errors are to be thrown
            if( allowedErrors['has_action_menu'] == consoleErrorSpy.mock.calls?.[0]?.[0] ) {
                /**
                 * To Do: FixMe
                 * Upstream:
                 *      Bug: https://github.com/patternfly/patternfly-react/issues/12295
                 *      PR: https://github.com/patternfly/patternfly-react/pull/12315
                 * 
                 * There is a bug in PatternFly when used with react 19. in my case
                 * the file in question was `/home/sysadmin/git/centurion-erp-ui/node_modules/@patternfly/react-core/dist/js/components/Drawer/DrawerPanelContent.js`
                 * 
                 * Issue presented itself when updating to `@patternfly/react-core@6.5.1`
                 * version `6.4.0` didn't have the issue
                 */

                expect(true);

            } else {

                expect(consoleErrorSpy).not.toHaveBeenCalled();

            }

        });


        test("Clearing notifications badge indicator colour 'read'", async () => {


            const InnerComponent = () => {

                const { setNotifications } = useNotificationContext()

                useEffect(() => {

                    setNotifications([])

                }, []);
                

                return (<></>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'button[aria-label="Notifications"]'
                );

                expect(notifications).not.toBeNull();

            });

            const htmlElement = rendered.container.querySelector('button[aria-label="Notifications"]');

            await waitFor(() => {

                expect(
                    screen.getByRole("button", { name: /notifications/i })
                ).toHaveClass("pf-m-read");

            });


            expect(String(htmlElement.classList).includes('pf-m-read')).toBe(true);


            // No errors are to be thrown
            if( allowedErrors['has_action_menu'] == consoleErrorSpy.mock.calls?.[0]?.[0] ) {
                /**
                 * To Do: FixMe
                 * Upstream:
                 *      Bug: https://github.com/patternfly/patternfly-react/issues/12295
                 *      PR: https://github.com/patternfly/patternfly-react/pull/12315
                 * 
                 * There is a bug in PatternFly when used with react 19. in my case
                 * the file in question was `/home/sysadmin/git/centurion-erp-ui/node_modules/@patternfly/react-core/dist/js/components/Drawer/DrawerPanelContent.js`
                 * 
                 * Issue presented itself when updating to `@patternfly/react-core@6.5.1`
                 * version `6.4.0` didn't have the issue
                 */

                expect(true);

            } else {

                expect(consoleErrorSpy).not.toHaveBeenCalled();

            }

        });


        test("Unread message count shows for one unread message", async () => {


            const InnerComponent = () => {

                const { setNotifications } = useNotificationContext()

                useEffect(() => {

                    setNotifications([unreadNotification])

                }, []);
                

                return (<></>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            Component: PageContent,
                            children: [
                                {
                                    path: objectMetadata.urls.self,
                                    Component: InnerComponent,
                                }
                            ]
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'span[class="pf-v6-c-button__text'
                );

                expect(notifications).not.toBeNull();

            });


            const htmlElement = rendered.container.querySelector('span[class="pf-v6-c-button__text"]');

            expect(htmlElement.innerHTML).toBe("1");


            // No errors are to be thrown
            if( allowedErrors['has_action_menu'] == consoleErrorSpy.mock.calls?.[0]?.[0] ) {
                /**
                 * To Do: FixMe
                 * Upstream:
                 *      Bug: https://github.com/patternfly/patternfly-react/issues/12295
                 *      PR: https://github.com/patternfly/patternfly-react/pull/12315
                 * 
                 * There is a bug in PatternFly when used with react 19. in my case
                 * the file in question was `/home/sysadmin/git/centurion-erp-ui/node_modules/@patternfly/react-core/dist/js/components/Drawer/DrawerPanelContent.js`
                 * 
                 * Issue presented itself when updating to `@patternfly/react-core@6.5.1`
                 * version `6.4.0` didn't have the issue
                 */

                expect(true);

            } else {

                expect(consoleErrorSpy).not.toHaveBeenCalled();

            }

        });


        test("No unread message count shows for one read message", async () => {


            const InnerComponent = () => {

                const { setNotifications } = useNotificationContext()

                useEffect(() => {

                    setNotifications([ {...unreadNotification, isNotificationRead: true} ])

                }, []);
                

                return (<></>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            path: objectMetadata.urls.self,
                            Component: InnerComponent,
                        }
                    ]
                }
            ]);

            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'button[aria-label="Notifications"]'
                );

                expect(notifications).not.toBeNull();

            });

            
            const htmlElement = rendered.container.querySelector('span[class="pf-v6-c-button__text"]');

            expect(htmlElement).toBe(null);


            // No errors are to be thrown
            if( allowedErrors['has_action_menu'] == consoleErrorSpy.mock.calls?.[0]?.[0] ) {
                /**
                 * To Do: FixMe
                 * Upstream:
                 *      Bug: https://github.com/patternfly/patternfly-react/issues/12295
                 *      PR: https://github.com/patternfly/patternfly-react/pull/12315
                 * 
                 * There is a bug in PatternFly when used with react 19. in my case
                 * the file in question was `/home/sysadmin/git/centurion-erp-ui/node_modules/@patternfly/react-core/dist/js/components/Drawer/DrawerPanelContent.js`
                 * 
                 * Issue presented itself when updating to `@patternfly/react-core@6.5.1`
                 * version `6.4.0` didn't have the issue
                 */

                expect(true);

            } else {

                expect(consoleErrorSpy).not.toHaveBeenCalled();

            }

        });


        test("'click on' Opens NotificationDrawer", async () => {


            const loader = async () => {

                return {
                    page_data: objectData,
                    metadata: objectMetadata
                };
            }


            const InnerComponent = () => {

                const {
                    alerts, setAlerts,
                    alertTimeout,
                    drawerRef,
                    isNotificationsOpen, setNotificationsOpen,
                    maxDisplayed,
                    notifications, setNotifications,
                    setOverflowMessage
                } = useNotificationContext();

                useEffect(() => {

                    setNotifications([ unreadNotification ])

                }, [isNotificationsOpen]);

                return (<span>text {isNotificationsOpen}</span>);
            };


            const Stub = createRoutesStub([
                {
                    Component: UI,
                    children: [
                        {
                            path: objectMetadata.urls.self,
                            Component: InnerComponent,
                        }
                    ],
                }
            ]);


            const rendered = render(
                <backendContext.Provider
                    value = {{
                        rootMetadata: rootMetadata,
                        url: 'url'
                    }}
                >
                    <NotificationContextProvider>
                        <Stub initialEntries={[objectMetadata.urls.self]} />
                    </NotificationContextProvider>
                </backendContext.Provider>
            );

            await waitFor(() => {

                const notifications = rendered.baseElement.querySelector(
                    'button[aria-label="Notifications"]'
                );

                expect(notifications).not.toBeNull();

            });

            const htmlElement = rendered.container.querySelector('button[aria-label="Notifications"]');

            expect(
                rendered.baseElement.querySelector('div[id="notifications-drawer"]')
            ).toBe(null);    // Ensure not open

            const user = userEvent.setup();

            await user.click(htmlElement);

            const notificationDrawer = await rendered.baseElement.querySelector('div[id="notifications-drawer"]');


            expect(notificationDrawer).not.toBe(null);


            // No errors are to be thrown
            if( allowedErrors['has_action_menu'] == consoleErrorSpy.mock.calls?.[0]?.[0] ) {
                /**
                 * To Do: FixMe
                 * Upstream:
                 *      Bug: https://github.com/patternfly/patternfly-react/issues/12295
                 *      PR: https://github.com/patternfly/patternfly-react/pull/12315
                 * 
                 * There is a bug in PatternFly when used with react 19. in my case
                 * the file in question was `/home/sysadmin/git/centurion-erp-ui/node_modules/@patternfly/react-core/dist/js/components/Drawer/DrawerPanelContent.js`
                 * 
                 * Issue presented itself when updating to `@patternfly/react-core@6.5.1`
                 * version `6.4.0` didn't have the issue
                 */

                expect(true);

            } else {

                expect(consoleErrorSpy).not.toHaveBeenCalled();

            }


        });


    });


});
