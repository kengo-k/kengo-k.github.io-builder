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
interface Context {
    addPage: (pageInfo: PageInfo) => void;
    pages: Page[];
}
interface PageInfo {
    permalink: string;
    frontmatter: {
        layout: string;
        title: string;
    };
    meta: {
        pid: string;
        id: string;
    };
}
declare const _default: (_: Option, context: Context) => {
    name: string;
    ready(): Promise<void>;
    clientDynamicModules(): Promise<{
        name: string;
        content: string;
    }[]>;
};
export default _default;
