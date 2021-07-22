import GraphicElement from '../GraphicElement';
import CustomElement from '../CustomElement';
import { getOverflowHeight, isOverflowHeight } from '../../service/util';

export default class GText extends GraphicElement {
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
                    console.log('dbclick !!');
                    this.textBox.elem.setAttribute('contenteditable','true');
                    this.textBox.elem.focus();
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
                }
            }
        });
        this.textBox.elem.setAttribute('style','display:inline-block;width:100%;height:100%;word-break:break-word;');

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get x(){
        return +this.foreignObj.elem.getAttribute('x');
    }

    set x(value){
        this.foreignObj.elem.setAttribute('x', value);
    }

    get y(){
        return +this.foreignObj.elem.getAttribute('y');
    }

    set y(value){
        this.foreignObj.elem.setAttribute('y', value);
    }

    get width(){
        return +this.foreignObj.elem.getAttribute('width');
    }

    set width(value){
        this.foreignObj.elem.setAttribute('width', value);
    }

    get height(){
        return +this.foreignObj.elem.getAttribute('height');
    }

    set height(value){
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

    clickHandler(e){
        console.log('gtext click !');
    }
}
