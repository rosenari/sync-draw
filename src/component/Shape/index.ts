import GraphicElement from '../CommonElement/GraphicElement';
import { Board, ItemMenubar, StyleMenubar, InnerText, SizeBorder, GroupBorder, Line } from '../../component';
import { ComponentRepository } from '../../service';
import {BOARD_ID, COLOR, MENU_BAR, FONT, PLACE_HOLDER_ID, COMPONENT_TYPE} from '../../service/constant';
import { getOverflowHeight, getOverflowWidth, isOverflowHeight, isOverflowWidth, IterableWeakMap } from '../../service/util';
import { ButtonInfo } from '../Toolbar/ItemMenubar';

export default class Shape extends GraphicElement {
    static type: string = COMPONENT_TYPE.Shape;
    public type: string = Shape.type;
    protected board = null;
    protected itemMenubar = null;
    protected styleMenubar = null;
    private _x = 0;
    private _y = 0;
    private _width = 0;
    private _height = 0;
    private _linkedLine = new IterableWeakMap();
    private _innerText = null;

    constructor({ parentId, id, tagName, x = 0, y = 0, width = 0, height = 0, classList = [], handlers = {},
                board = <Board>ComponentRepository.getComponentById(BOARD_ID),
                itemMenubar = <ItemMenubar>ComponentRepository.getComponentById(MENU_BAR.ITEM_MENU_BAR_ID),
                styleMenubar = <StyleMenubar>ComponentRepository.getComponentById(MENU_BAR.STYLE_MENU_BAR_ID)}: {
        parentId: string, id: string, tagName: string, x?: number, y?: number, width?:number, height?: number, classList?: Array<string>, handlers?: object,
        board?: Board, itemMenubar?: ItemMenubar, styleMenubar?: StyleMenubar
    }) {
        super({ parentId, id, tagName, classList, handlers });
        this.board = board;
        this.itemMenubar = itemMenubar;
        this.styleMenubar = styleMenubar;
        this.fill = COLOR.WHITE;
        this.strokeColor = COLOR.BLACK;
        this.elem.setAttribute('stroke-width', '3');
    }

    renderLinkedLine() {
        Array.from(this.linkedLine.keys()).forEach(line => {
            if(this.board.border?.shapes?.includes?.(line)) return;

            const pointInfo = this.linkedLine.get(line);
            const points = [...line.points];
            const x = Math.round(this.x + (this.width * pointInfo.ratios[0]));
            const y = Math.round(this.y + (this.height * pointInfo.ratios[1]));

            points[pointInfo.index].x = x;
            points[pointInfo.index].y = y;

            line.points = points;
        });
    }

    get x(): number {
        return this.getX();
    }

    public getX() {
        return this._x;
    }

    set x(value: number) {
        this.setX(value);
    }

    public setX(value: number){
        this._x = value;
        this.renderLinkedLine();
        if(this.innerText) this.innerText.x = value;
    }

    public get y(): number {
        return this.getY();
    }

    public getY(): number{
        return this._y;
    }

    public set y(value: number) {
        this.setY(value);
    }

    public setY(value: number){
        this._y = value;
        this.renderLinkedLine();
        if(this.innerText) this.innerText.y = value;
    }

    get width(): number {
        return this.getWidth();
    }

    public getWidth(){
        return this._width;
    }

    set width(value: number) {
        this.setWidth(value);
    }

    public setWidth(value: number) {
        this._width = value;
        this.renderLinkedLine();
        if (this.innerText) this.innerText.width = value;
    }

    get height(): number {
        return this.getHeight();
    }

    public getHeight(): number{
        return this._height;
    }

    set height(value: number) {
        this.setHeight(value);
    }

    public setHeight(value: number){
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
        if(!this.innerText) return;

        this.innerText.fontSize = value;
    }

    get fontColor(){
        if(!this.innerText) return null;

        return this.innerText.fontColor;
    }

    set fontColor(value){
        if(!this.innerText) return;

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
        Array.from(this.linkedLine.keys()).forEach(storeLine => {
            if( line === storeLine && Number(pointInfo.index) === Number(this.linkedLine.get(storeLine).index)){
                this.linkedLine.delete(line);
            }
        });
    }

    createInnerText(defaultText = 'shape') {
        if(this.id === PLACE_HOLDER_ID) return;

        this.innerText = new InnerText({
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
            this.width += getOverflowWidth(this.innerText.textBox.elem) + InnerText.padding * 2;
        }

        if(isOverflowHeight(this.innerText.textBox.elem)){
            this.height += getOverflowHeight(this.innerText.textBox.elem) + InnerText.padding * 2;
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
                    id: line.id,
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

    setProperty({ linkedLineIds = [], text = '', fontSize = FONT.SIZE_3, fontColor = COLOR.BLACK, fill = COLOR.BLACK, strokeColor = COLOR.BLACK }){
        linkedLineIds.forEach(({id, pointInfo}) => this.addLinkedLine({ line: ComponentRepository.getComponentById(id), pointInfo }));
        this.innerText.textBox.elem.innerText = text;
        this.fontSize = fontSize;
        this.fontColor = fontColor;
        this.fill = fill;
        this.strokeColor = strokeColor;
    }

    dbClickHandler(e) {
        if(this.innerText) this.innerText.textBox.dbClickHandler(e);
    }

    clickHandler(e, selected = <ButtonInfo>ComponentRepository.getComponentById(this.itemMenubar.selectMenu)) {
        if(selected.name !== 'mouse'){
            return;
        }

        if(e?.shiftKey && this.board.border) {
            if(!(this.board.border instanceof SizeBorder) && !(this.board.border instanceof GroupBorder)) return;
            let shapes = [];
            const target = this;
            if(this.board.border instanceof SizeBorder) {
                const sizeBorderTarget = this.board.border.target;
                shapes.push(sizeBorderTarget);
                if(sizeBorderTarget !== target) shapes.push(target);
            }else if(this.board.border instanceof GroupBorder) {
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
        this.innerText?.elem.parentNode?.appendChild?.(this.innerText?.elem);

        this.board.destroyBorder();
        this.board.createSizeBorder(this);

        this.styleMenubar.show();
        this.styleMenubar.fontSizeSelect.elem.value = this.innerText?.fontSize || this.fontSize;
        this.styleMenubar.fontColorInput.elem.value = this.innerText?.fontColor || this.fontColor;
        this.styleMenubar.fillInput.elem.value = this.fill || this.fill;
        this.styleMenubar.strokeInput.elem.value = this.strokeColor || this.strokeColor;
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