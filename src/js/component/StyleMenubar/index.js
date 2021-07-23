import CustomElement from '../CustomElement';
import CustomSelect from '../CustomSelect';
import CustomInput from '../CustomInput';
import './index.css';

export default class StyleMenubar extends CustomElement{
    _fontSizeText = null;
    _fontSizeSelect = null;
    _fontColorText = null;
    _fontColorInput = null;
    _fillText = null;
    _fillInput = null;
    _strokeText = null;
    _strokeInput = null;

    constructor({parentId}) {
        super({
            parentId,
            id: 'style-menu-bar',
            tagName: 'div',
            classList:['style-menu-bar']
        });

        this.fontSizeText = new CustomElement({
            parentId: this.id,
            id: 'style-font-size-text',
            tagName: 'div',
            content: '폰트사이즈',
            classList:['style-text']
        });

        this.fontSizeSelect = new CustomSelect({
            parentId: this.id,
            id: 'style-font-size-select',
            classList:['style-select'],
            options:{
                'size 1' : '8px',
                'size 2' : '10px',
                'size 3' : '12px',
                'size 4' : '14px',
                'size 5' : '16px',
                'size 6' : '18px',
            },
            handlers:{
                changeHandler: function(e){
                    console.log('change !!');
                }
            }
        });

        this.fontColorText = new CustomElement({
            parentId: this.id,
            id: 'style-font-color-text',
            tagName: 'div',
            content: '폰트색상',
            classList:['style-text','style-font-color-text']
        });

        this.fontColorInput = new CustomInput({
            parentId: this.id,
            id: 'style-font-color-input',
            type: 'color',
            classList: ['style-input'],
            handlers: {
                changeHandler: function(e){
                    console.log(e.target.value);
                }
            }
        });

        this.fillText = new CustomElement({
            parentId: this.id,
            id: 'style-fill-text',
            tagName: 'div',
            content: '배경색상',
            classList:['style-text']
        });

        this.fillInput = new CustomInput({
            parentId: this.id,
            id: 'style-fill-input',
            type: 'color',
            classList: ['style-input'],
            handlers: {
                changeHandler: function(e){
                    console.log(e.target.value);
                }
            }
        });

        this.strokeText = new CustomElement({
            parentId: this.id,
            id: 'style-stroke-text',
            tagName: 'div',
            content: '테두리색상',
            classList:['style-text']
        });

        this.strokeInput = new CustomInput({
            parentId: this.id,
            id: 'style-stroke-input',
            type: 'color',
            classList: ['style-input'],
            handlers: {
                changeHandler: function(e){
                    console.log(e.target.value);
                }
            }
        });

    }

    get fontSizeText() {
        return this._fontSizeText;
    }

    set fontSizeText(value) {
        this._fontSizeText = value;
    }

    get fontSizeSelect() {
        return this._fontSizeSelect;
    }

    set fontSizeSelect(value) {
        this._fontSizeSelect = value;
    }

    get fontColorText() {
        return this._fontColorText;
    }

    set fontColorText(value) {
        this._fontColorText = value;
    }

    get fontColorInput() {
        return this._fontColorInput;
    }

    set fontColorInput(value) {
        this._fontColorInput = value;
    }

    get fillText() {
        return this._fillText;
    }

    set fillText(value) {
        this._fillText = value;
    }

    get fillInput() {
        return this._fillInput;
    }

    set fillInput(value) {
        this._fillInput = value;
    }

    get strokeText() {
        return this._strokeText;
    }

    set strokeText(value) {
        this._strokeText = value;
    }

    get strokeInput() {
        return this._strokeInput;
    }

    set strokeInput(value) {
        this._strokeInput = value;
    }
}