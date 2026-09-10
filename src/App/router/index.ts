
import djangoLoader from "../pageLoaders/django"
import djangoMetadataLoader from "../pageLoaders/djangoMetadata"
import djangoRootMetadataLoader from "../pageLoaders/djangoRootMetadata"
import githubLoader from "../pageLoaders/github"

import {
    APISubmitAction
} from "../../components/DisplayFields"

import History from "../../layout/history"
import List from "../../layout/List"
import Settings from "../../layout/Settings"
import Ticket from "../../layout/Ticket"

import BackendLayout from "../../layouts/Backend"
import Base from "../../layouts/Base"
import DetailLayout from "../../layouts/Detail"
import Markdown from "../../layout/Markdown"
import Redirect from "../../layouts/Redirect"

import {
    RouteDescription,
} from "../../types/backend/apiMetadata/RouteDescriptions"



/**
 * @since 0.13.0
 */
export const pageActions = {
    api: APISubmitAction
}



/**
 * @since 0.13.0
 */
export const pageComponents = {
    backend: BackendLayout,
    baseview: Base,
    detail: DetailLayout,
    history: History,
    redirect: Redirect,
    list: List,
    markdown: Markdown,
    settings: Settings,
    ticket: Ticket
};



/**
 * @since 0.13.0
 */
export const pageLoaders = {
    django: djangoLoader,
    django_metadata: djangoMetadataLoader,
    django_root_metadata: djangoRootMetadataLoader,
    github: githubLoader
};
