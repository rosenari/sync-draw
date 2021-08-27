import CustomElement from '../CustomElement';
import { Border, Shape } from '../../../component';
import {CreateOption} from '../../../interface';
import { ButtonInfo } from "../../Toolbar/ItemMenubar";

interface CustomButtonOption extends CreateOption {
    cursorType?: string
}

export default class CustomButton extends CustomElement{
    private _cursorType: string = null;
    public name: string;
    public relatedBorder: Border;
    public relatedClass: Shape;
    public relatedMouseDownHandler: (e: MouseEvent, selected: ButtonInfo) => void;
    public relatedMouseMoveHandler: (e: MouseEvent) => void;
    public relatedMouseUpHandler: (e: MouseEvent) => void;

    constructor({parentId, id, content, classList, cursorType = 'default', handlers = {}}: CustomButtonOption) {
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
}