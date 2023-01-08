interface Option {
}
interface Page {
    key: string;
    frontmatter: Frontmatter;
    path: string;
    title: string;
}
interface Frontmatter {
    tags: string[];
}
interface DynamicModule {
    name: string;
    content: string;
}
interface Context {
    addPage: (pageInfo: PageInfo) => void;
    pages: Page[];
    dynamicModules?: DynamicModule[];
}
interface PageInfo {
    permalink: string;
    frontmatter: {
        layout: string;
        title: string;
    };
    meta: {
        article_keys?: string[];
    };
}
declare const _default: (_: Option, context: Context) => {
    name: string;
    extendPageData(page: any): void;
    additionalPages(): Promise<{
        path: string;
        filePath: string;
        meta: {
            article_ids: string[];
        };
    }[]>;
    ready(): Promise<void>;
    clientDynamicModules(): Promise<DynamicModule[] | undefined>;
};
export default _default;
