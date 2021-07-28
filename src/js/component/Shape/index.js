import GraphicElement from '../GraphicElement';
import ComponentRepository from "../../service/ComponentRepository";
import SizeBorder from "../SizeBorder";
import Line from "../Line";

export default class Shape extends GraphicElement{
    _x = 0;
    _y = 0;
    _width = 0;
    _height = 0;

    constructor({ parentId, id, tagName, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, tagName, classList, handlers });
        this.elem.setAttribute('fill','white');
        this.elem.setAttribute('stroke', '#555');
        this.elem.setAttribute('stroke-width', '3');
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    clickHandler(e) {
        const repository = ComponentRepository.getInstance();
        const board = repository.getComponentById('board');
        const itemMenubar = repository.getComponentById('item-menu-bar');
        if(repository.getComponentById(itemMenubar.selectMenu).name !== 'mouse'){
            return;
        }

        board.destroyBorder();
        board.border = new SizeBorder({
            parentId: 'temp-group',
            target: this
        });
    }
}