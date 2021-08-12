import GraphicElement from '../GraphicElement';
import CustomElement from '../CustomElement';
import {getOverflowHeight, isOverflowHeight, rgbToHex} from '../../service/util';
import ComponentRepository from '../../service/ComponentRepository';
import SizeBorder from '../Border/SizeBorder';
import TransformManager from '../../service/TransformManager';
import {BOARD_ID, COLOR, GROUP, MENU_BAR, FONT} from '../../service/constant';

class GText extends GraphicElement {
    _foreignObj = null;
    _textBox = null;

    constructor({ parentId, id, x, y, width, height, classList, handlers }) {
        super({ parentId, id, tagName: 'g', classList, handlers });
        this.foreignObj = new GraphicElement({
            parentId:this.id,
            id:id + '-foreignobj',
            tagName:'foreignObject'
        });

        this.textBox = new CustomElement({
            parentId: this.foreignObj.id,
            id: id + '-textbox',
            tagName: 'div',
            content: 'text',
            handlers: {
                dbClickHandler: (e) => {
                    this.textBox.elem.setAttribute('contenteditable','true');
                    this.textBox.elem.focus();

                    destroyBorder();
                },
                clickHandler: (e) => {
                    this.clickHandler(e);
                },
                blurHandler: (e) => {
                    this.textBox.elem.setAttribute('contenteditable','false');
                },
                keyUpHandler: (e) => {
                    if(isOverflowHeight(this.textBox.elem)){
                        this.height += getOverflowHeight(this.textBox.elem);
                    }

                    destroyBorder();
                }
            }
        });
        this.textBox.elem.setAttribute('style','display:inline-block;width:100%;height:100%;word-break:break-word;user-select:none;');
        this.fontColor = COLOR.BLACK;
        this.fontSize = FONT.SIZE_3;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get x() {
        return +this.foreignObj.elem.getAttribute('x');
    }

    set x(value) {
        this.foreignObj.elem.setAttribute('x', value);
    }

    get y() {
        return +this.foreignObj.elem.getAttribute('y');
    }

    set y(value) {
        this.foreignObj.elem.setAttribute('y', value);
    }

    get width() {
        return +this.foreignObj.elem.getAttribute('width');
    }

    set width(value) {
        this.foreignObj.elem.setAttribute('width', value);
    }

    get height() {
        return +this.foreignObj.elem.getAttribute('height');
    }

    set height(value) {
        this.foreignObj.elem.setAttribute('height', value);
    }

    get foreignObj() {
        return this._foreignObj;
    }

    set foreignObj(value) {
        this._foreignObj = value;
    }

    get textBox() {
        return this._textBox;
    }

    set textBox(value) {
        this._textBox = value;
    }

    get fontSize(){
        return this.textBox.elem.style.fontSize;
    }

    set fontSize(value){
        this.textBox.elem.style.fontSize = value;
    }

    get fontColor(){
        return rgbToHex(this.textBox.elem.style.color);
    }

    set fontColor(value){
        this.textBox.elem.style.color = value;
    }

    serialize(){
        const type = [this.__proto__.__proto__.constructor.name];
        const text = this.textBox.elem.innerText;
        const property = {
            id: this.id,
            parentId: this.parentId,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fontSize: this.fontSize,
            fontColor: this.fontColor
        };

        return JSON.stringify({
            type,
            text,
            ...property,
        });
    }

    setProperty({ text, fontSize, fontColor }){
        this.textBox.elem.innerText = text;
        this.fontSize = fontSize;
        this.fontColor = fontColor;
    }

    dbClickHandler(e){
        this.textBox.dbClickHandler(e);
    }

    clickHandler(e) {
        const board = ComponentRepository.getComponentById(BOARD_ID);
        const styleMenubar = ComponentRepository.getComponentById(MENU_BAR.STYLE_MENU_BAR_ID);
        board.destroyBorder();
        board.border = new SizeBorder({
            parentId: GROUP.TEMP_GROUP_ID,
            target: this
        });
        styleMenubar.fontSizeSelect.elem.value = this.fontSize;
        styleMenubar.fontColorInput.elem.value = this.fontColor;
        styleMenubar.show();
    }
}

function destroyBorder(){
    const board = ComponentRepository.getComponentById(BOARD_ID);
    board.destroyBorder();
}

export default TransformManager.wrapShape(GText);