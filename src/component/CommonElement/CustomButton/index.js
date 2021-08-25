import CustomElement from '../CustomElement';

export default class CustomButton extends CustomElement{
    _cursorType = null;
    constructor({parentId, id, content, classList, cursorType = 'default', handlers = {}}) {
        super({
            parentId,
            id,
            tagName: 'button',
            content,
            classList,
            handlers
        });
        this.cursorType = cursorType;
    }

    get cursorType() {
        return this._cursorType;
    }

    set cursorType(value) {
        this._cursorType = value;
    }
}