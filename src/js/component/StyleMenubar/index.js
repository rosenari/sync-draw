import CustomElement from '../CustomElement';
import CustomSelect from '../CustomSelect';
import CustomInput from '../CustomInput';
import {
    BOARD_ID,
    FONT, MENU_BAR, STYLE_ELEM
} from '../../service/constant';
import ComponentRepository from "../../service/ComponentRepository";
import './index.css';
import {debounce} from "../../service/util";

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
            id: MENU_BAR.STYLE_MENU_BAR_ID,
            tagName: 'div',
            classList:['style-menu-bar']
        });

        this.fontSizeText = new CustomElement({
            parentId: this.id,
            id: STYLE_ELEM.FONT_SIZE_TEXT_ID,
            tagName: 'div',
            content: '폰트사이즈',
            classList:['style-text']
        });

        this.fontSizeSelect = new CustomSelect({
            parentId: this.id,
            id: STYLE_ELEM.FONT_SIZE_SELECT_ID,
            classList:['style-select'],
            options:{
                'size 1' : FONT.SIZE_1,
                'size 2' : FONT.SIZE_2,
                'size 3' : FONT.SIZE_3,
                'size 4' : FONT.SIZE_4,
                'size 5' : FONT.SIZE_5,
                'size 6' : FONT.SIZE_6,
            },
            handlers:{
                changeHandler: function(e){
                    const board = ComponentRepository.getComponentById(BOARD_ID);
                    if(board.border?.fontSize) board.border.fontSize = e.target.value;
                }
            }
        });

        this.fontColorText = new CustomElement({
            parentId: this.id,
            id: STYLE_ELEM.FONT_COLOR_TEXT_ID,
            tagName: 'div',
            content: '폰트색상',
            classList:['style-text','style-font-color-text']
        });

        this.fontColorInput = new CustomInput({
            parentId: this.id,
            id: STYLE_ELEM.FONT_COLOR_TEXT_INPUT,
            type: 'color',
            classList: ['style-input'],
            handlers: {
                inputHandler: debounce(function(e){
                    const board = ComponentRepository.getComponentById(BOARD_ID);
                    if(board.border?.fontColor) board.border.fontColor = e.target.value;
                },300)
            }
        });

        this.fillText = new CustomElement({
            parentId: this.id,
            id: STYLE_ELEM.FILL_TEXT_ID,
            tagName: 'div',
            content: '배경색상',
            classList:['style-text']
        });

        this.fillInput = new CustomInput({
            parentId: this.id,
            id: STYLE_ELEM.FILL_INPUT_ID,
            type: 'color',
            classList: ['style-input'],
            handlers: {
                inputHandler: debounce(function(e){
                    const board = ComponentRepository.getComponentById(BOARD_ID);
                    if(board.border?.fill) board.border.fill = e.target.value;
                },300)
            }
        });

        this.strokeText = new CustomElement({
            parentId: this.id,
            id: STYLE_ELEM.STROKE_TEXT_ID,
            tagName: 'div',
            content: '테두리색상',
            classList:['style-text']
        });

        this.strokeInput = new CustomInput({
            parentId: this.id,
            id: STYLE_ELEM.STROKE_INPUT_ID,
            type: 'color',
            classList: ['style-input'],
            handlers: {
                inputHandler: debounce(function(e){
                    const board = ComponentRepository.getComponentById(BOARD_ID);
                    if(board.border?.strokeColor) board.border.strokeColor = e.target.value;
                },300)
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

    show(){
        this.elem.style.border = '1px solid #ddd';
        this.elem.style.height ='220px';
    }

    hide(){
        this.elem.style.height ='0px';
        this.elem.style.border = '1px solid #fff';
    }
}