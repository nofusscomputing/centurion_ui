import {
    useEffect,
    useState
} from "react";

import {
    useLoaderData,
} from "react-router";

import {
    Content,
    JumpLinks,
    JumpLinksItem,
    JumpLinksList,
    Label,
    LabelGroup,
    PageSection,
    Sidebar,
    SidebarContent,
    SidebarPanel,
    Title
} from "@patternfly/react-core";

import RenderMarkdown from "../functions/RenderMarkdown";
import { useIsMobile } from "../hooks/useIsMobile";

import { TagIcon } from "@patternfly/react-icons"
import {
    usePageContext
} from "../layouts/PageContent";


function getHeadings( root = null ) {
        root ??= document.querySelector('.markdown.pf-v6-c-content.full-width');

        if (!root) {
            return [];
        }

    const headings = [...root.querySelectorAll('h1,h2,h3,h4,h5,h6')];

    const tree = [];
    const stack = [];

    for (const heading of headings) {
        const level = Number(heading.tagName[1]);

        const node = {
            level,
            id: heading.id,
            tag: heading.tagName.toLowerCase(),
            text: heading.textContent.trim(),
            element: heading,
            children: [],
        };

        while (stack.length && stack.at(-1).level >= level) {
            stack.pop();
        }

        if (stack.length) {
            stack.at(-1).children.push(node);
        } else {
            tree.push(node);
        }

        stack.push(node);
    }

    return {
        children: tree
    }

}


const JumpLinksWrapper = ({toc}) => {


    function tocEntries(toc = null, level = 1) {

        return (
            <>
                {toc.children.map((navHeading) => {

                    const text = `${String(navHeading.text).replace('¶', '').trim()}`

                    const href = `#${String(navHeading.id ? navHeading.id : text).trim().replace(' ', '-').toLowerCase()}`

                    if( navHeading.children.length > 0 ) {

                        return (
                            <JumpLinksItem
                                key = {`toc-${navHeading.level}-${String(href).replace('#', '')}`}
                                href={href}
                                isActive = { href === document.location.hash ? true : false }
                                
                            >
                                {text}
                                <JumpLinksList>
                                    {tocEntries(navHeading, (level + 1))}
                                </JumpLinksList>
                            </JumpLinksItem>
                        )
                    }

                    return (
                        <JumpLinksItem
                            key = {`toc-${navHeading.level}-${String(href).replace('#', '')}`}
                            href={href}
                            isActive = { href === document.location.hash ? true : false }
                        >
                            {text}
                        </JumpLinksItem>
                    );
                })}
            </>
        );

    }

    return tocEntries(toc, 1)
};



/**
 * Render a markdown document as a single page.
 * 
 * @summary Markdown Page Layout
 * 
 * @category Layout
 * @since 0.12.0
 */
const Markdown = (): React.JSX.Element => {

    const {
        setAdditionalPageFooter,
        setPageDescription, setPageHeading, setPageHeaderIcons,
    } = usePageContext()

    const isMobile = useIsMobile();

    const [isVertical, setIsVertical] = useState(false);

    const markdown = useLoaderData();

    const [ markdownDocument, setMarkdownDocument ] = useState(markdown);

    const [ markdownDocumentFrontMatter, setMarkdownDocumentFrontMatter ] = useState(null)

    const [ markdownDocumentTOC, setMarkdownDocumentTOC ] = useState(null)

    const [ pageHeadings, setPageHeadings] = useState(null);


    useEffect(() => {

        if( ! markdownDocumentFrontMatter ) return

        setIsVertical(isMobile);

        if( Object.hasOwn(markdownDocumentFrontMatter, 'title') ) {
            setPageHeading(markdownDocumentFrontMatter.title)
        }

        if( Object.hasOwn(markdownDocumentFrontMatter, 'description') ) {
            setPageDescription(markdownDocumentFrontMatter.description)
        }

        const heda = getHeadings()

        setPageHeadings(heda)

    }, [
        markdownDocumentFrontMatter
    ]);


    const frontmatterCallback = (frontMatter) => {

        if( ! markdownDocumentFrontMatter ) setMarkdownDocumentFrontMatter(frontMatter);

        console.log(frontMatter)


        const RemoveFrontmatter = new RegExp(/^(?<frontMatter>---\n[\S|\s]+\n---\n)(?<document>[\S|\s]+)/g)

    };

    const tocCallback = (toc) => {

        if( ! markdownDocumentTOC ) setMarkdownDocumentTOC(toc);

    }


    const mdPageFooter = (
        <PageSection
            variant="secondary"
        >
            { markdownDocumentFrontMatter &&
            <Content isEditorial={true}>
                <Title headingLevel="h2">About</Title>
                <p>This page forms part of our Project -ToDo add project name-</p>

                <Title headingLevel="h3">Metadata</Title>
                <p>Version: ToDo: place files short git commit here</p>
                <p>Created: { markdownDocumentFrontMatter.date }</p>

                <p>Date Edited: 2025-12-03</p>

                <Title headingLevel="h3">Contribution</Title>
                <p>Would You like to contribute to our Centurion ERP UI project? You can assist in the following ways:</p>

                <ul>
                    <li>Edit This Page If there is a mistake or a way you can improve it.</li>
                    <li>Add a Page to the Manual if you would like to add an item to our manual</li>
                    <li>Raise an Issue if there is something about this page you would like to improve, and git is unfamiliar to you.</li>
                </ul>

                <p>ToDo: Add the page list of contributors</p>
            </Content>}
        </PageSection>
    );

    useEffect(() => {

        if( markdownDocumentFrontMatter ) {

            setAdditionalPageFooter(mdPageFooter)

        }

    }, [
        // mdPageFooter
        markdownDocumentFrontMatter
    ]);


    const [offsetHeight, setOffsetHeight] = useState(100);


    return (
        <>
            <PageSection
                isFilled = {true}
                padding={{ default: 'noPadding'}}
            >
                <Sidebar
                    hasGutter
                    isPanelRight
                    id="scrollable-element"
                >
                    { pageHeadings &&
                    
                    <SidebarPanel
                        variant="sticky"
                    >

                        <JumpLinks
                            isVertical={!isVertical}
                            isCentered={isVertical}
                            label="Contents"
                            // offset={offsetHeight}
                            scrollableSelector="#scrollable-element"
                            expandable={{
                                default: isVertical ? 'expandable' : 'nonExpandable',
                                lg: 'nonExpandable'
                            }}
                            isExpanded={!isVertical}
                        >
                            <JumpLinksWrapper toc={pageHeadings} />

                        </JumpLinks>

                    </SidebarPanel>}
                    <SidebarContent>
                        {markdownDocumentFrontMatter?.tags &&
                        <PageSection
                            padding={{ default: 'noPadding'}}
                        >

                            <LabelGroup
                                categoryName = "Tags"
                            >
                                {markdownDocumentFrontMatter.tags.map(tag => {

                                    return (
                                        <Label icon={<TagIcon />}>{tag}</Label>
                                    );
                                })}
                            </LabelGroup>
                        </PageSection>}

                        <PageSection
                            padding={{ default: 'noPadding'}}
                        >

                            <Content isEditorial={true}>

                                <RenderMarkdown
                                    full_width={true}
                                    env={{}}
                                    frontmatterCallback={frontmatterCallback}
                                    tocCallback = {tocCallback}
                                >
                                    {String(
                                        markdownDocument
                                    ).replaceAll(
                                        '(./', `(${document.location.pathname}/`
                                    ).replaceAll(
                                        'index.md)', ')'
                                    ).replaceAll(
                                        '.md)', ')'
                                    )}
                                </RenderMarkdown>

                            </Content>
                        </PageSection>
                    </SidebarContent>
                </Sidebar>
            </PageSection>
        </>
    );

}
 
export default Markdown;
