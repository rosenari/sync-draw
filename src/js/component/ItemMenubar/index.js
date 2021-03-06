import CustomElement from '../CustomElement';
import CustomButton from '../CustomButton';
import ComponentRepository from '../../service/ComponentRepository';
import {
    DISK_ICON, DOCUMENT_ICON, HAND_GRAB, IO_ICON, JUDGMENT_ICON, LINE_ICON, MOUSE_CURSOR,
    PAGECONN_ICON, PINPUT_ICON, POLYLINE_ICON, PROCESS_ICON, READY_ICON, TERMINAL_ICON
} from '../../images';
import CreateBorder from '../Border/CreateBorder';
import DragBorder from '../Border/DragBorder';
import { GTerminal, GReady, GProcess, GJudgment, GPageconn, GDocument,
    GInputoutput, GPinput, GText, GDisk, GLine, GPolyline} from '../../component';
import {BOARD_ID, CURSOR_TYPE, MENU_BAR} from '../../service/constant';
import './index.css';

export default class ItemMenubar extends CustomElement{
    _selectMenu = null;
    _handBtn = null; //화면 이동 탭
    _mouseBtn = null; //마우스 탭
    _textBtn = null; //텍스트 탭
    _terminalGBtn = null; //단말 요소 탭
    _readyGBtn = null; //준비 요소 탭
    _processGBtn = null; //처리 요소 탭
    _judgmentGBtn = null; //판단 요소 탭
    _lineGBtn = null; //흐름선 요소 탭
    _ploylineGBtn = null; //직선 요소 탭
    _pageconnGBtn = null; //페이지 연결자 요소 탭
    _docGBtn = null; //서류 요소 탭
    _diskGBtn = null; //디스크 요소 탭
    _ioGBtn = null; //입출력 요소 탭
    _pinputGBtn = null; //수동입력 요소 탭

    constructor({parentId}) {
        super({
            parentId,
            id: MENU_BAR.ITEM_MENU_BAR_ID,
            tagName: 'div',
            classList:['item-menu-bar']
        });

        const buttonInfos = [
            {
                name: 'hand',
                icon: HAND_GRAB,
                iconSize: { width: '35', height: '35' },
                cursorType: CURSOR_TYPE.GRAB
            },
            {
                name: 'mouse',
                icon: MOUSE_CURSOR,
                iconSize: { width: '35', height: '35' },
                relatedBorder: DragBorder
            },
            {
                name: 'text',
                content: 'Text',
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: CreateBorder,
                relatedClass: GText
            },
            {
                name: 'terminal',
                icon: TERMINAL_ICON,
                iconSize: { width: '34', height: '18' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: CreateBorder,
                relatedClass: GTerminal
            },
            {
                name: 'ready',
                icon: READY_ICON,
                iconSize: { width:'34', height: '18' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: CreateBorder,
                relatedClass: GReady
            },
            {
                name: 'process',
                icon: PROCESS_ICON,
                iconSize: { width: '34', height: '18'},
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: CreateBorder,
                relatedClass: GProcess
            },
            {
                name: 'judgment',
                icon: JUDGMENT_ICON,
                iconSize: { width:'34', height:'18' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: CreateBorder,
                relatedClass: GJudgment
            },
            {
                name: 'line',
                icon: LINE_ICON,
                iconSize: { width:'34', height:'10' },
                cursorType: CURSOR_TYPE.SRESIZE,
                relatedClass: GLine
            },
            {
                name: 'ployline',
                icon: POLYLINE_ICON,
                iconSize: { width:'34', height:'45' },
                cursorType: CURSOR_TYPE.SRESIZE,
                relatedClass: GPolyline
            },
            {
                name: 'pageconn',
                icon: PAGECONN_ICON,
                iconSize: { width: '40', height: '40' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: CreateBorder,
                relatedClass: GPageconn
            },
            {
                name: 'doc',
                icon: DOCUMENT_ICON,
                iconSize: { width: '35', height: '35' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: CreateBorder,
                relatedClass: GDocument
            },
            {
                name: 'disk',
                icon: DISK_ICON,
                iconSize: { width: '35', height: '35' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: CreateBorder,
                relatedClass: GDisk
            },
            {
                name: 'io',
                icon: IO_ICON,
                iconSize: { width: '34', height: '18' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: CreateBorder,
                relatedClass: GInputoutput
            },
            {
                name: 'pinput',
                icon: PINPUT_ICON,
                iconSize: { width: '34', height: '34' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: CreateBorder,
                relatedClass: GPinput
            }
        ];

        const createButton = ({ name, content, icon, iconSize, cursorType, relatedBorder = null, relatedClass = null}) => {
            const button =  new CustomButton({
                parentId: this.id,
                id: `item-${name}-btn`,
                content: content || `<img src='data:image/svg+xml;base64,${icon}' style='pointer-events: none;' width=${iconSize.width} height=${iconSize.height}  alt="loading" />`,
                classList: ['item-btn',`item-${name}-btn`],
                cursorType,
                handlers: {
                    clickHandler: (e) => {
                        ComponentRepository.getComponentById(BOARD_ID).destroyBorder();
                        this.selectMenu = ComponentRepository.getComponentById(e.target.id);
                    }
                }
            });
            button.name = name;
            button.relatedBorder = relatedBorder;
            button.relatedClass = relatedClass;

            return button;
        }

        const commonBtn = ['hand','mouse','text'];

        const registerButton = (button) => {
            if(commonBtn.includes(button.name)){
                this[`${button.name}Btn`] = button;
                return;
            }

            this[`${button.name}GBtn`] = button;
        }

        buttonInfos.map(createButton).forEach(registerButton);

        this.selectMenu = this.mouseBtn;
    }

    get selectMenu() {
        return this._selectMenu;
    }

    set selectMenu(value) {
        for(const key in this){
            if(this[key] instanceof CustomButton) this[key].elem.classList.remove('item-btn-active');
        }
        value.elem.classList.add('item-btn-active');
        changeCursor(value.cursorType);
        this._selectMenu = value.id;
    }

    get handBtn() {
        return this._handBtn;
    }

    get mouseBtn() {
        return this._mouseBtn;
    }

    get textBtn() {
        return this._textBtn;
    }

    get terminalGBtn() {
        return this._terminalGBtn;
    }

    get readyGBtn() {
        return this._readyGBtn;
    }

    get processGBtn() {
        return this._processGBtn;
    }

    get judgmentGBtn() {
        return this._judgmentGBtn;
    }

    get lineGBtn() {
        return this._lineGBtn;
    }

    get ploylineGBtn() {
        return this._ploylineGBtn;
    }

    get pageconnGBtn() {
        return this._pageconnGBtn;
    }

    get docGBtn() {
        return this._docGBtn;
    }

    get diskGBtn() {
        return this._diskGBtn;
    }

    get ioGBtn() {
        return this._ioGBtn;
    }

    get pinputGBtn() {
        return this._pinputGBtn;
    }

    set handBtn(value) {
        this._handBtn = value;
    }

    set mouseBtn(value) {
        this._mouseBtn = value;
    }

    set textBtn(value) {
        this._textBtn = value;
    }

    set terminalGBtn(value) {
        this._terminalGBtn = value;
    }

    set readyGBtn(value) {
        this._readyGBtn = value;
    }

    set processGBtn(value) {
        this._processGBtn = value;
    }

    set judgmentGBtn(value) {
        this._judgmentGBtn = value;
    }

    set lineGBtn(value) {
        this._lineGBtn = value;
    }

    set ploylineGBtn(value) {
        this._ploylineGBtn = value;
    }

    set pageconnGBtn(value) {
        this._pageconnGBtn = value;
    }

    set docGBtn(value) {
        this._docGBtn = value;
    }

    set diskGBtn(value) {
        this._diskGBtn = value;
    }

    set ioGBtn(value) {
        this._ioGBtn = value;
    }

    set pinputGBtn(value) {
        this._pinputGBtn = value;
    }
}

function changeCursor(type){
    ComponentRepository.getComponentById(BOARD_ID).elem.setAttribute('style',`width:100%;height:100%;cursor:${type};`)
}