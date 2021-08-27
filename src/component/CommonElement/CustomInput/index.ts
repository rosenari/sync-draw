import CustomElement from '../CustomElement';

export default class CustomInput extends CustomElement{
    constructor({ parentId, id, type = '', classList = [], handlers = {}}: {
        parentId: string;
        id: string;
        type?: string;
        classList?: Array<string>;
        handlers?: {
            [key: string]: any;
        }
    }) {
        super({
            parentId,
            id,
            tagName: 'input',
            classList,
            handlers
        });

        this.elem.setAttribute('type', type);
    }
}