
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


import UI from "../../../layouts/ui"
import { UserProvider } from "../../../hooks/UserContext"
import List from "../../List";
import PageContent from "../../../layouts/PageContent";
import { NotificationContextProvider } from "../../../components/NotificationDrawer";


const fs = require('fs')
const path = require('path')


describe("List Layout", () => {

    const baseDir = path.join(__dirname, '../../../../includes/usr/share/nginx/html/mock/api/v2')


    let consoleErrorSpy;

    const allowedErrors = [];

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });




    const listBaseDir = path.join(baseDir, '/layout')

    const listIds = fs.readdirSync(listBaseDir)

    const backendAPIData = listIds
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


    const rootMetadataLoader = () => {

        const optionsFilePath = path.join(baseDir, 'OPTIONS.json')

        const rawOptions = fs.readFileSync(optionsFilePath, 'utf8')

        const jsonOptions = JSON.parse(rawOptions)


        return {
            page_data: null,
            metadata: jsonOptions
        }

    }



    const { data: objectDataTable, options: objectMetadataTable } = backendAPIData[0];



    test('Has DataSet Header', () => {

        const loader = async () => {

            return {
                page_data: objectDataTable,
                metadata: objectMetadataTable
            };
        }


        const Stub = createRoutesStub([
            {
                Component: UI,
                loader: rootMetadataLoader,
                children: [
                    {
                        Component: PageContent,
                        children: [
                            {
                                path: objectMetadataTable.urls.self,
                                Component: List,
                                loader: loader
                            }
                        ]
                    }
                    
                ],
            }
        ]);


        const rendered = render(
            <NotificationContextProvider>
                <Stub initialEntries={[objectMetadataTable.urls.self]} />
            </NotificationContextProvider>
        );


        const element = rendered.container.querySelector('div[id="dataset-header-toolbar"]')

        expect(String(rendered.innerHTML)).not.toBe('')

        // No errors are to be thrown
        expect(consoleErrorSpy).not.toHaveBeenCalled();

    });


    test('Has DataSetList', () => {

        const loader = async () => {

            return {
                page_data: objectDataTable,
                metadata: objectMetadataTable
            };
        }


        const Stub = createRoutesStub([
            {
                Component: UI,
                loader: rootMetadataLoader,
                children: [
                    {
                        Component: PageContent,
                        children: [
                            {
                                path: objectMetadataTable.urls.self,
                                Component: List,
                                loader: loader
                            }
                        ]
                    }
                    
                ],
            }
        ]);


        const rendered = render(
            <NotificationContextProvider>
                <Stub initialEntries={[objectMetadataTable.urls.self]} />
            </NotificationContextProvider>
        );


        const element = rendered.container.querySelector('ul[id="dataset-list"]')

        expect(String(rendered.innerHTML)).not.toBe('')

        // No errors are to be thrown
        expect(consoleErrorSpy).not.toHaveBeenCalled();

    });


    test('Has DataSet Footer', () => {

        const loader = async () => {

            return {
                page_data: objectDataTable,
                metadata: objectMetadataTable
            };
        }


        const Stub = createRoutesStub([
            {
                Component: UI,
                loader: rootMetadataLoader,
                children: [
                    {
                        Component: PageContent,
                        children: [
                            {
                                path: objectMetadataTable.urls.self,
                                Component: List,
                                loader: loader
                            }
                        ]
                    }
                    
                ],
            }
        ]);


        const rendered = render(
            <NotificationContextProvider>
                <Stub initialEntries={[objectMetadataTable.urls.self]} />
            </NotificationContextProvider>
        );


        const element = rendered.container.querySelector('div[id="bottom-pagination-bottom-pagination"]')

        expect(String(rendered.innerHTML)).not.toBe('')

        // No errors are to be thrown
        expect(consoleErrorSpy).not.toHaveBeenCalled();

    });



});
