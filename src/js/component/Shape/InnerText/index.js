import CustomElement from '../../CommonElement/CustomElement';
import GraphicElement from '../../CommonElement/GraphicElement';
import { Service } from '../../../service';
import {BEHAVIOR, BOARD_ID, COMPONENT_TYPE, PHRASES} from '../../../service/constant';
import {getOverflowHeight, isOverflowHeight, rgbToHex, focusTextRange} from '../../../service/util';

export default class InnerText extends GraphicElement{
    static type = COMPONENT_TYPE.InnerText;
    static padding = 20;
    board = null;
    type = InnerText.type;
    _foreignObj = null;
    _textBox = null;

    constructor({ parentId, id, x, y, width, height, content, relatedShapeId, classList, handlers
                    , board = Service.ComponentRepository.getComponentById(BOARD_ID) }) {
        super({ parentId, id, tagName: 'g', classList, handlers });
        this.board = board;

        this.foreignObj = new GraphicElement({
            parentId:this.id,
            id:id + '-foreignobj',
            tagName:'foreignObject'
        });

        this.textBox = new CustomElement({
            parentId: this._foreignObj.id,
            id: id + '-textbox',
            tagName: 'div',
            content,
            handlers: {
                dbClickHandler: (e) => {
                    this.textBox.elem.setAttribute('contenteditable','true');
                    focusTextRange(this.textBox.elem);

                    this.board.destroyBorder();
                },
                clickHandler: (e) => {
                    const relatedShape = Service.ComponentRepository.getComponentById(relatedShapeId);
                    relatedShape.clickHandler(e);
                },
                blurHandler: (e) => {
                    Service.HistoryManager.updateHistoryToLatest({behavior: BEHAVIOR.MODIFY, type: `${this.type}`});
                    this._textBox.elem.setAttribute('contenteditable','false');
                },
                keyUpHandler: (e) => {
                    if(isOverflowHeight(this._textBox.elem)){
                        const relatedShape = Service.ComponentRepository.getComponentById(relatedShapeId);
                        relatedShape.height += getOverflowHeight(this._textBox.elem);
                    }
                    if(this._textBox.elem.innerText.length > 50){
                        alert(PHRASES.TEXT_INPUT_OVER);
                        this._textBox.elem.innerText = this._textBox.elem.innerText.slice(0,50);
                    }
                    if (e.code === 'Enter') {
                        Service.HistoryManager.updateHistoryToLatest({behavior: BEHAVIOR.MODIFY, type: `${this.type}`});
                        this._textBox.elem.innerText = this._textBox.elem.innerText.trim();
                        return this._textBox.elem.blur();
                    }

                    this.board.destroyBorder();
                }
            }
        });

        this._textBox.elem.setAttribute('style','display:flex;width:100%;height:100%;word-break:break-word;user-select:none;align-items: center;justify-content: center;');

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get x() {
        return +this.foreignObj.elem.getAttribute('x');
    }

    set x(value) {
        const paddingValue = +value + InnerText.padding;
        this.foreignObj.elem.setAttribute('x', paddingValue);
    }

    get y() {
        return +this.foreignObj.elem.getAttribute('y');
    }

    set y(value) {
        const paddingValue = +value + InnerText.padding;
        this.foreignObj.elem.setAttribute('y', paddingValue);
    }

    get width() {
        return +this.foreignObj.elem.getAttribute('width');
    }

    set width(value) {
        let paddingValue =  value - (InnerText.padding * 2);
        if(paddingValue < 0) paddingValue = 0;
        this.foreignObj.elem.setAttribute('width', paddingValue);
    }

    get height() {
        return +this.foreignObj.elem.getAttribute('height');
    }

    set height(value) {
        let paddingValue =  value - (InnerText.padding * 2);
        if(paddingValue < 0) paddingValue = 0;
        this.foreignObj.elem.setAttribute('height', paddingValue);
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
}