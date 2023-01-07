interface Option {
}
interface Page {
    key: string;
    frontmatter: Frontmatter;
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
