
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



import {
    render,
    screen,
} from "@testing-library/react"

import {
    createRoutesStub,
} from 'react-router'

import Detail from "../../../layout/Detail"
import UI from "../../ui"
import { UserProvider } from "../../../hooks/UserContext"
import List from "../../../layout/List";
import Ticket from "../../../layout/Ticket";
import { NotificationContextProvider } from "../../../components/NotificationDrawer";
import PageContent from "../../PageContent";
import { backendContext } from "../../../App/providers/backend";
import Base from "../../Base";


const fs = require('fs')
const path = require('path')


describe("PageContent Layout", () => {

    const baseDir = path.join(__dirname, '../../../../includes/usr/share/nginx/html/mock/api/v2')


    let consoleErrorSpy;

    const allowedErrors = [
        // /Warning: ReactDOM\.render is deprecated/,
        // /act\(\.\.\.\)/,
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


    describe("List Layout", () => {


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
            // }
        })
    

        test.each(listLayout)(
            'List Layout - $options.name',
            async ({ data, options }) => {

                const loader = async () => {

                    return {
                        page_data: data,
                        metadata: options
                    };
                }

                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: options.urls.self,
                                        Component: List,
                                        loader: loader
                                    }
                                ]
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
                            <Stub initialEntries={[options.urls.self]} />
                        </NotificationContextProvider>
                    </backendContext.Provider>
                );

                const headings = await screen.findAllByRole("heading", { level: 1 })

                expect(headings[1].textContent).toBe(options.name);

            }
        )


        test.each(listLayout)(
            'List Layout (No Errors) - $options.name',
            async ({ data, options }) => {

                const loader = async () => {

                    return {
                        page_data: data,
                        metadata: options
                    };
                }


                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: options.urls.self,
                                        Component: List,
                                        loader: loader
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: rootMetadata,
                            url: 'url'
                        }}
                    >
                        <NotificationContextProvider>
                            <Stub initialEntries={[options.urls.self]} />
                        </NotificationContextProvider>
                    </backendContext.Provider>
                );

                const headings = await screen.findAllByRole("heading", { level: 1 })

                expect(consoleErrorSpy).not.toHaveBeenCalled();

            }
        )


    });



    describe("Detail Layout", () => {


        const detailBaseDir = path.join(baseDir, '/features/fields')

        const detailIds = fs.readdirSync(detailBaseDir)


        const detailLayout = detailIds.map(id => {

            const filePath = path.join(detailBaseDir, '', id, 'GET.json')

            const raw = fs.readFileSync(filePath, 'utf8')

            const json = JSON.parse(raw)

            const optionsFilePath = path.join(detailBaseDir, id, 'OPTIONS.json')

            const rawOptions = fs.readFileSync(optionsFilePath, 'utf8')

            const jsonOptions = JSON.parse(rawOptions)


            return {
                data: json,
                options: jsonOptions
            }

        })



        test.each(detailLayout)(
            'Detail Layout - $data.name - $data.id',
            async ({ data, options }) => {

                const loader = async () => {

                    return {
                        page_data: data,
                        metadata: options
                    };
                }


                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: data._urls._self.split('api/v2')[1],
                                        Component: Detail,
                                        loader: loader
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: rootMetadata,
                            url: 'url'
                        }}
                    >
                        <NotificationContextProvider>
                            <Stub initialEntries={[data._urls._self.split('api/v2')[1]]} />
                        </NotificationContextProvider>
                    </backendContext.Provider>
                );

                const headings = await screen.findAllByRole("heading", { level: 1 })

                expect(headings[1].textContent).toBe(data.name);

            }
        )


        test.each(detailLayout)(
            'Detail Layout (No Errors) - $data.name - $data.id',
            async ({ data, options }) => {

                const loader = async () => {

                    return {
                        page_data: data,
                        metadata: options
                    };
                }


                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: data._urls._self.split('api/v2')[1],
                                        Component: Detail,
                                        loader: loader
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: rootMetadata,
                            url: 'url'
                        }}
                    >
                        <NotificationContextProvider>
                            <Stub initialEntries={[data._urls._self.split('api/v2')[1]]} />
                        </NotificationContextProvider>
                    </backendContext.Provider>
                );

                const headings = await screen.findAllByRole("heading", { level: 1 })

                expect(consoleErrorSpy).not.toHaveBeenCalled();

            }
        )


    });



    describe("Ticket Layout", () => {


        const ticketBaseDir = path.join(baseDir, '/layout/ticket/request')

        const ticketIds = fs.readdirSync(ticketBaseDir)


        const ticketLayout = ticketIds
            .filter(id => !String(id).includes('.'))
            .map(id => {

                const filePath = path.join(ticketBaseDir, '', id, 'GET.json')

                const raw = fs.readFileSync(filePath, 'utf8')

                const json = JSON.parse(raw)

                const optionsFilePath = path.join(ticketBaseDir, id, 'OPTIONS.json')

                const rawOptions = fs.readFileSync(optionsFilePath, 'utf8')

                const jsonOptions = JSON.parse(rawOptions)


                return {
                    data: json,
                    options: jsonOptions
                }

            })



        test.each(ticketLayout)(
            'Ticket Layout - $data.title - $data.id',
            async ({ data, options }) => {

                const loader = async () => {

                    return {
                        page_data: data,
                        metadata: options
                    };
                }


                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: data._urls._self.split('api/v2')[1],
                                        Component: Ticket,
                                        loader: loader
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: rootMetadata,
                            url: 'url'
                        }}
                    >
                        <NotificationContextProvider>
                            <Stub initialEntries={[data._urls._self.split('api/v2')[1]]} />
                        </NotificationContextProvider>
                    </backendContext.Provider>
                );


                const headings = await screen.findAllByRole("heading", { level: 1 })

                expect(headings[1].textContent).toBe(data.title);

            }
        )


        test.each(ticketLayout)(
            'Ticket Layout (No Errors) - $data.title - $data.id',
            async ({ data, options }) => {

                const loader = async () => {

                    return {
                        page_data: data,
                        metadata: options
                    };
                }


                const Stub = createRoutesStub([
                    {
                        Component: UI,
                        children: [
                            {
                                Component: PageContent,
                                children: [
                                    {
                                        path: data._urls._self.split('api/v2')[1],
                                        Component: Ticket,
                                        loader: loader
                                    }
                                ]
                            }
                        ],
                    }
                ]);


                render(
                    <backendContext.Provider
                        value = {{
                            rootMetadata: rootMetadata,
                            url: 'url'
                        }}
                    >
                        <NotificationContextProvider>
                            <Stub initialEntries={[data._urls._self.split('api/v2')[1]]} />
                        </NotificationContextProvider>
                    </backendContext.Provider>
                );

                const headings = await screen.findAllByRole("heading", { level: 1 })

                expect(consoleErrorSpy).not.toHaveBeenCalled();

            }
        )


    });



});
