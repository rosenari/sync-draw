import GraphicElement from '../../GraphicElement';
import CustomElement from '../../CustomElement';
import {getOverflowHeight, isOverflowHeight} from '../../../service/util';
import ComponentRepository from '../../../service/ComponentRepository';
import { BOARD_ID } from '../../../service/constant';

export default class InnerText extends GraphicElement{
    static padding = 20;
    _foreignObj = null;
    _textBox = null;

    constructor({ parentId, id, x, y, width, height, content, relatedShapeId, classList, handlers }) {
        super({ parentId, id, tagName: 'g', classList, handlers });

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

                    destroyBorder();
                },
                clickHandler: (e) => {
                    const relatedShape = ComponentRepository.getComponentById(relatedShapeId);
                    relatedShape.clickHandler(e);
                },
                blurHandler: (e) => {
                    this._textBox.elem.setAttribute('contenteditable','false');
                },
                keyUpHandler: (e) => {
                    if(isOverflowHeight(this._textBox.elem)){
                        const relatedShape = ComponentRepository.getComponentById(relatedShapeId);
                        relatedShape.height += getOverflowHeight(this._textBox.elem);
                    }
                    if(this._textBox.elem.innerText.length > 50){
                        alert('텍스트 입력은 50자 이상을 초과할 수 없습니다.');
                        this._textBox.elem.innerText = this._textBox.elem.innerText.slice(0,50);
                    }
                    if (e.code === 'Enter') {
                        this._textBox.elem.innerText = this._textBox.elem.innerText.trim();
                        return this._textBox.elem.blur();
                    }

                    destroyBorder();
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
}

function destroyBorder(){
    const board = ComponentRepository.getComponentById(BOARD_ID);
    board.destroyBorder();
}

function focusTextRange(elem){
    const range = document.createRange();
    range.selectNodeContents(elem);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}