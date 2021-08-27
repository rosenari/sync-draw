import CustomElement from '../CustomElement';
import { Border, Shape } from '../../../component';
import { ClickElement } from '../../../interface';

export default class CustomButton extends CustomElement implements ClickElement{
    private _cursorType: string = null;
    public name: string;
    public relatedBorder: Border;
    public relatedClass: Shape;
    public relatedMouseDownHandler: Function;
    public relatedMouseMoveHandler: Function;
    public relatedMouseUpHandler: Function;

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

    get cursorType(): string {
        return this._cursorType;
    }

    set cursorType(value: string) {
        this._cursorType = value;
    }

    clickHandler(e?: MouseEvent){}

}