import CustomElement from '../CustomElement';
import CustomSelect from '../CustomSelect';
import CustomInput from '../CustomInput';
import {
    FONT_SIZE_1,
    FONT_SIZE_2,
    FONT_SIZE_3,
    FONT_SIZE_4,
    FONT_SIZE_5,
    FONT_SIZE_6, STYLE_FILL_INPUT_ID, STYLE_FILL_TEXT_ID,
    STYLE_FONT_COLOR_TEXT_ID,
    STYLE_FONT_COLOR_TEXT_INPUT,
    STYLE_FONT_SIZE_SELECT_ID,
    STYLE_FONT_SIZE_TEXT_ID,
    STYLE_MENU_BAR_ID, STYLE_STROKE_INPUT_ID, STYLE_STROKE_TEXT_ID
} from '../../service/constant';
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
            id: STYLE_MENU_BAR_ID,
            tagName: 'div',
            classList:['style-menu-bar']
        });

        this.fontSizeText = new CustomElement({
            parentId: this.id,
            id: STYLE_FONT_SIZE_TEXT_ID,
            tagName: 'div',
            content: '폰트사이즈',
            classList:['style-text']
        });

        this.fontSizeSelect = new CustomSelect({
            parentId: this.id,
            id: STYLE_FONT_SIZE_SELECT_ID,
            classList:['style-select'],
            options:{
                'size 1' : FONT_SIZE_1,
                'size 2' : FONT_SIZE_2,
                'size 3' : FONT_SIZE_3,
                'size 4' : FONT_SIZE_4,
                'size 5' : FONT_SIZE_5,
                'size 6' : FONT_SIZE_6,
            },
            handlers:{
                changeHandler: function(e){
                    console.log('change !!');
                }
            }
        });

        this.fontColorText = new CustomElement({
            parentId: this.id,
            id: STYLE_FONT_COLOR_TEXT_ID,
            tagName: 'div',
            content: '폰트색상',
            classList:['style-text','style-font-color-text']
        });

        this.fontColorInput = new CustomInput({
            parentId: this.id,
            id: STYLE_FONT_COLOR_TEXT_INPUT,
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
            id: STYLE_FILL_TEXT_ID,
            tagName: 'div',
            content: '배경색상',
            classList:['style-text']
        });

        this.fillInput = new CustomInput({
            parentId: this.id,
            id: STYLE_FILL_INPUT_ID,
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
            id: STYLE_STROKE_TEXT_ID,
            tagName: 'div',
            content: '테두리색상',
            classList:['style-text']
        });

        this.strokeInput = new CustomInput({
            parentId: this.id,
            id: STYLE_STROKE_INPUT_ID,
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