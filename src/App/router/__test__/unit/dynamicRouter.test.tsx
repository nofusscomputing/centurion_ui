
import dynamicRouter from "../../dynamicRouter";
import { pageComponents } from "../..";
import Base from "../../../../layouts/Base";
import RouteErrorBoundary from "../../../../layouts/ErrorBoundary";
import NotificationLayout from "../../../../layouts/Notifications";
import UI from "../../../../layouts/ui";
import PageContent from "../../../../layouts/PageContent";



const router = dynamicRouter();

const routes = router.routes;


describe("Error Boundary", () => {


    const testParams = [
        {
            name: 'Base - id',
            value: routes[0].id,
            expected: 'base'
        },
        {
            name: 'Base - action',
            value: routes[0].action,
            expected: undefined
        },
        {
            name: 'Base - Component',
            value: routes[0].element.type,
            expected: pageComponents['baseview']
        },
        {
            name: 'Base - ErrorBoundary',
            value: routes[0].errorElement.type,
            expected: RouteErrorBoundary
        },
        {
            name: 'Base - HydrateFallback',
            value: Object.hasOwn(routes[0], 'hydrateFallbackElement'),
            expected: true
        },
        {
            name: 'Base - handle.base_url',
            value: routes[0].handle,
            expected: undefined
        },
        {
            name: 'Base - loader',
            value: routes[0].loader,
            expected: undefined
        },
        {
            name: 'Base - shouldRevalidate',
            value: routes[0].shouldRevalidate,
            expected: undefined
        },
        {
            name: 'Base - children',
            value: routes[0].children.length,
            expected: 3
        },


        {
            name: 'Root Backend - id',
            value: routes[0].children[2].id,
            expected: 'root-backend'
        },
        {
            name: 'Root Backend - action',
            value: routes[0].children[2].action,
            expected: undefined
        },
        {
            name: 'Root Backend - Component',
            value: routes[0].children[2].element.type,
            expected: pageComponents['backend']
        },
        {
            name: 'Root Backend - ErrorBoundary',
            value: routes[0].children[2].errorElement,
            expected: undefined
        },
        {
            name: 'Root Backend - handle.base_url',
            value: routes[0].children[2].handle,
            expected: {
                backend_url: window.env.API_URL
            }
        },
        {
            name: 'Root Backend - HydrateFallback',
            value: routes[0].children[2].hydrateFallbackElement,
            expected: undefined
        },
        {
            name: 'Root Backend - loader',
            value: routes[0].children[2].loader,
            expected: undefined
        },
        {
            name: 'Root Backend - shouldRevalidate',
            value: routes[0].children[2].shouldRevalidate,
            expected: undefined
        },
        {
            name: 'Root Backend - children',
            value: routes[0].children[2].children.length,
            expected: 1
        },




        {
            name: 'Notification Provider - id',
            value: routes[0].children[2].children[0].id,
            expected: 'notifications'
        },
        {
            name: 'Notification Provider  - action',
            value: routes[0].children[2].children[0].action,
            expected: undefined
        },
        {
            name: 'Notification Provider - Component',
            value: routes[0].children[2].children[0].element.type,
            expected: NotificationLayout
        },
        {
            name: 'Notification Provider  - ErrorBoundary',
            value: routes[0].children[2].children[0].errorElement,
            expected: undefined
        },
        {
            name: 'Notification Provider  - handle.base_url',
            value: routes[0].children[2].children[0].handle,
            expected: undefined
        },
        {
            name: 'Notification Provider - HydrateFallback',
            value: routes[0].children[2].children[0].hydrateFallbackElement,
            expected: undefined
        },
        {
            name: 'Notification Provider  - loader',
            value: routes[0].children[2].children[0].loader,
            expected: undefined
        },
        {
            name: 'Notification Provider  - shouldRevalidate',
            value: routes[0].children[2].children[0].shouldRevalidate,
            expected: undefined
        },
        {
            name: 'Notification Provider - children',
            value: routes[0].children[2].children[0].children.length,
            expected: 1
        },




        {
            name: 'UI - id',
            value: routes[0].children[2].children[0].children[0].id,
            expected: 'UI'
        },
        {
            name: 'UI  - action',
            value: routes[0].children[2].children[0].children[0].action,
            expected: undefined
        },
        {
            name: 'UI - Component',
            value: routes[0].children[2].children[0].children[0].element.type,
            expected: UI
        },
        {
            name: 'UI - ErrorBoundary',
            value: routes[0].children[2].children[0].children[0].errorElement.type,
            expected: RouteErrorBoundary
        },
        {
            name: 'UI - handle.base_url',
            value: routes[0].children[2].children[0].children[0].handle,
            expected: undefined
        },
        {
            name: 'UI - HydrateFallback',
            value: Object.hasOwn(routes[0].children[2].children[0].children[0], 'hydrateFallbackElement'),
            expected: true
        },
        {
            name: 'UI  - loader',
            value: routes[0].children[2].children[0].children[0].loader,
            expected: undefined
        },
        {
            name: 'UI - shouldRevalidate',
            value: routes[0].children[2].children[0].children[0].shouldRevalidate,
            expected: undefined
        },
        {
            name: 'UI - children',
            value: routes[0].children[2].children[0].children[0].children.length,
            expected: 1
        },



        {
            name: 'page - id',
            value: routes[0].children[2].children[0].children[0].children[0].id,
            expected: 'page'
        },
        {
            name: 'page  - action',
            value: routes[0].children[2].children[0].children[0].children[0].action,
            expected: undefined
        },
        {
            name: 'page - Component',
            value: routes[0].children[2].children[0].children[0].children[0].element.type,
            expected: PageContent
        },
        {
            name: 'page - ErrorBoundary',
            value: routes[0].children[2].children[0].children[0].children[0].errorElement,
            expected: undefined
        },
        {
            name: 'page - handle.base_url',
            value: routes[0].children[2].children[0].children[0].children[0].handle,
            expected: undefined
        },
        {
            name: 'page - HydrateFallback',
            value: Object.hasOwn(routes[0].children[2].children[0].children[0].children[0], 'hydrateFallbackElement'),
            expected: true
        },
        {
            name: 'page  - loader',
            value: routes[0].children[2].children[0].children[0].children[0].loader,
            expected: undefined
        },
        {
            name: 'page  - shouldRevalidate',
            value: routes[0].children[2].children[0].children[0].children[0].shouldRevalidate,
            expected: undefined
        },
        {
            name: 'page - children',
            value: routes[0].children[2].children[0].children[0].children[0].children,
            expected: undefined
        },

    ]

    describe("default Routes", () => {


        test.each(testParams)(
            "Route - $name",
            ({value, expected}) => {


            expect(value).toEqual(expected)

        });
    });
});
