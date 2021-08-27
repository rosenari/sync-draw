export default interface CreateOption {
    parentId: string;
    id: string;
    classList?: Array<string>;
    handlers?: {
        [key: string]: any;
    }
    tagName?: string;
    xmlns?: string;
    content?: string;
}