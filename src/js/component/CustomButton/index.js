import CustomElement from '../CustomElement';

export default class CustomButton extends CustomElement{
    constructor({parentId, id, content, classList, handlers = {}}) {
        super({
            parentId,
            id,
            tagName: 'button',
            content,
            classList,
            handlers
        });
    }
}