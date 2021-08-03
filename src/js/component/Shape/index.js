import GraphicElement from '../GraphicElement';
import ComponentRepository from '../../service/ComponentRepository';
import SizeBorder from '../Border/SizeBorder';
import {BOARD_ID, COLOR, MENU_BAR, GROUP} from '../../service/constant';
import {IterableWeakMap} from '../../service/util';
import InnerText from "./InnerText";

export default class Shape extends GraphicElement {
    _x = 0;
    _y = 0;
    _width = 0;
    _height = 0;
    _linkedLine = new IterableWeakMap();
    _innerText = null;

    constructor({ parentId, id, tagName, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, tagName, classList, handlers });
        this.elem.setAttribute('fill','white');
        this.elem.setAttribute('stroke', COLOR.BLACK);
        this.elem.setAttribute('stroke-width', '3');
    }

    renderLinkedLine() {
        for(const line of this.linkedLine.keys()) {
            const pointInfo = this.linkedLine.get(line);
            const points = [...line.points];
            const x = Math.round(this.x + (this.width * pointInfo.ratios[0]));
            const y = Math.round(this.y + (this.height * pointInfo.ratios[1]));

            points[pointInfo.index].x = x;
            points[pointInfo.index].y = y;

            line.points = points;
        }
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
        this.renderLinkedLine();
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
        this.renderLinkedLine();
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this.renderLinkedLine();
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
        this.renderLinkedLine();
    }

    get linkedLine() {
        return this._linkedLine;
    }

    set linkedLine(value){
        this._linkedLine = value;
    }

    get innerText() {
        return this._innerText;
    }

    set innerText(value) {
        this._innerText = value;
    }

    addLinkedLine({ line, pointInfo }){
        this.linkedLine.set(line,pointInfo);
    }

    removeLinkedLine({ line }){
        this.linkedLine.delete(line);
    }

    createInnerText(defaultText = 'shape') {
        /*this.innerText = new InnerText({
            parentId,
            id: this.id + '-innerText',
            x: this.x - 30,
            y: this.y - 30,
            width:this.width - 60,
            height
        });*/
    }

    clickHandler(e) {
        const board = ComponentRepository.getComponentById(BOARD_ID);
        const itemMenubar = ComponentRepository.getComponentById(MENU_BAR.ITEM_MENU_BAR_ID);
        if(ComponentRepository.getComponentById(itemMenubar.selectMenu).name !== 'mouse'){
            return;
        }

        this.elem.parentNode?.appendChild?.(this.elem);

        board.destroyBorder();
        board.border = new SizeBorder({
            parentId: GROUP.TEMP_GROUP_ID,
            target: this
        });
    }
}