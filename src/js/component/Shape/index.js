import GraphicElement from '../CommonElement/GraphicElement';
import { Shapes, Borders } from '../index';
import { Service } from '../../service';
import { BOARD_ID, COLOR, MENU_BAR, FONT, PLACE_HOLDER_ID } from '../../service/constant';
import { getOverflowHeight, getOverflowWidth, isOverflowHeight, isOverflowWidth, IterableWeakMap } from '../../service/util';

export default class Shape extends GraphicElement {
    board = null;
    itemMenubar = null;
    styleMenubar = null;
    _x = 0;
    _y = 0;
    _width = 0;
    _height = 0;
    _linkedLine = new IterableWeakMap();
    _innerText = null;

    constructor({ parentId, id, tagName, x = 0, y = 0, width = 0, height = 0, classList, handlers,
                board = Service.ComponentRepository.getComponentById(BOARD_ID),
                itemMenubar = Service.ComponentRepository.getComponentById(MENU_BAR.ITEM_MENU_BAR_ID),
                styleMenubar = Service.ComponentRepository.getComponentById(MENU_BAR.STYLE_MENU_BAR_ID)}) {
        super({ parentId, id, tagName, classList, handlers });
        this.board = board;
        this.itemMenubar = itemMenubar;
        this.styleMenubar = styleMenubar;
        this.fill = COLOR.WHITE;
        this.strokeColor = COLOR.BLACK;
        this.elem.setAttribute('stroke-width', '3');
    }

    renderLinkedLine() {
        for(const line of this.linkedLine.keys()) {
            if(this.board.border?.shapes?.includes?.(line)){
                continue;
            }

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
        if(this.innerText) this.innerText.x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
        this.renderLinkedLine();
        if(this.innerText) this.innerText.y = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this.renderLinkedLine();
        if(this.innerText) this.innerText.width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
        this.renderLinkedLine();
        if(this.innerText) this.innerText.height = value;
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

    get fontSize(){
        if(!this.innerText) return null;

        return this.innerText.fontSize;
    }

    set fontSize(value){
        if(!this.innerText) return null;

        this.innerText.fontSize = value;
    }

    get fontColor(){
        if(!this.innerText) return null;

        return this.innerText.fontColor;
    }

    set fontColor(value){
        if(!this.innerText) return null;

        this.innerText.fontColor = value;
    }

    get fill(){
        return this.elem.getAttribute('fill');
    }

    set fill(value){
        this.elem.setAttribute('fill', value);
    }

    get strokeColor(){
        return this.elem.getAttribute('stroke');
    }

    set strokeColor(value){
        this.elem.setAttribute('stroke', value);
    }

    addLinkedLine({ line, pointInfo }){
        this.linkedLine.set(line,pointInfo);
    }

    removeLinkedLine({ line, pointInfo }){
        for(const storeLine of this.linkedLine.keys()) {
            if( line === storeLine && Number(pointInfo.index) === Number(this.linkedLine.get(storeLine).index)){
                this.linkedLine.delete(line);
            }
        }
    }

    createInnerText(defaultText = 'shape') {
        if(this.id === PLACE_HOLDER_ID) return;

        this.innerText = new Shapes.InnerText({
            parentId: this.parentId,
            id: this.id + '-innerText',
            x: this.x,
            y: this.y,
            width:this.width,
            height:this.height,
            content: defaultText,
            relatedShapeId: this.id
        });
        this.innerText.fontSize = FONT.SIZE_3;
        this.innerText.fontColor = COLOR.BLACK;

        if(isOverflowWidth(this.innerText.textBox.elem)){
            this.width += getOverflowWidth(this.innerText.textBox.elem) + Shapes.InnerText.padding * 2;
        }

        if(isOverflowHeight(this.innerText.textBox.elem)){
            this.height += getOverflowHeight(this.innerText.textBox.elem) + Shapes.InnerText.padding * 2;
        }
    }

    serialize(){
        const type = this.type;
        const text = this.innerText.textBox.elem.innerText;
        const property = {
            id: this.id,
            parentId: this.parentId,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            linkedLineIds: Array.from(this.linkedLine?.keys?.() || [])?.map?.(line => {
                return {
                    id:line.id,
                    pointInfo: this.linkedLine.get(line)
                }
            }),
            fontSize: this.fontSize,
            fontColor: this.fontColor,
            fill: this.fill,
            strokeColor: this.strokeColor
        };

        return JSON.stringify({
            text,
            type,
            ...property,
        });
    }

    setProperty({ linkedLineIds, text, fontSize, fontColor, fill, strokeColor }){
        linkedLineIds.forEach(({id, pointInfo}) => this.addLinkedLine({ line: Service.ComponentRepository.getComponentById(id), pointInfo }));
        this.innerText.textBox.elem.innerText = text;
        this.fontSize = fontSize;
        this.fontColor = fontColor;
        this.fill = fill;
        this.strokeColor = strokeColor;
    }

    dbClickHandler(e) {
        if(this.innerText) this.innerText.textBox.dbClickHandler(e);
    }

    clickHandler(e) {
        if(Service.ComponentRepository.getComponentById(this.itemMenubar.selectMenu).name !== 'mouse'){
            return;
        }

        if(e?.shiftKey && this.board.border) {
            if(!(this.board.border instanceof Borders.SizeBorder) && !(this.board.border instanceof Borders.GroupBorder)) return;
            let shapes = [];
            const target = this;
            if(this.board.border instanceof Borders.SizeBorder) {
                const sizeBorderTarget = this.board.border.target;
                shapes.push(sizeBorderTarget);
                if(sizeBorderTarget !== target) shapes.push(target);
            }else if(this.board.border instanceof Borders.GroupBorder) {
                shapes = this.board.border.shapes;
                shapes.push(target);
            }
            const { x, y, width, height} = createGroupInfo(shapes);
            this.board.destroyBorder();
            this.board.createGroupBorder({
                x, y, width, height, shapes
            });
            return;
        }

        this.elem.parentNode?.appendChild?.(this.elem);
        this.innerText.elem.parentNode?.appendChild?.(this.innerText.elem);

        this.board.destroyBorder();
        this.board.createSizeBorder(this);

        this.styleMenubar.show();
        this.styleMenubar.fontSizeSelect.elem.value = this.innerText.fontSize;
        this.styleMenubar.fontColorInput.elem.value = this.innerText.fontColor;
        this.styleMenubar.fillInput.elem.value = this.fill;
        this.styleMenubar.strokeInput.elem.value = this.strokeColor;
    }
}

function createGroupInfo(shapes){
    const x = Math.min(...shapes.map(shape => shape.x));
    const y = Math.min(...shapes.map(shape => shape.y));
    const width = Math.max(...shapes.map(shape => shape.x + shape.width)) - x;
    const height = Math.max(...shapes.map(shape => shape.y + shape.height )) - y;

    return {
        x, y, width, height
    };
}