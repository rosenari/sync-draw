import CustomElement from '../CustomElement';

export default class CustomInput extends CustomElement{
    constructor({ parentId, id, type, classList, handlers}) {
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