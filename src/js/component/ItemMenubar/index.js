import CustomElement from '../CustomElement';
import CustomButton from '../CustomButton';
import ComponentRepository from '../../service/ComponentRepository';
import {
    DISK_ICON,
    DOCUMENT_ICON,
    HAND_GRAB, IO_ICON,
    JUDGMENT_ICON,
    LINE_ICON,
    MOUSE_CURSOR, PAGECONN_ICON, PINPUT_ICON,
    POLYLINE_ICON,
    PROCESS_ICON,
    READY_ICON,
    TERMINAL_ICON
} from '../../images';
import Border from '../Border';
import CreateBorder from '../CreateBorder';
import GTerminal from '../Shape/Rect/GTerminal';
import GReady from '../Shape/Polygon/GReady';
import GProcess from '../Shape/Rect/GProcess';
import GJudgment from '../Shape/Polygon/GJudgment';
import GPageconn from '../Shape/Polygon/GPageconn';
import GDocument from '../Shape/Path/GDocument';
import GInputoutput from '../Shape/Polygon/GInputoutput';
import GPinput from '../Shape/Polygon/GPinput';
import GText from '../GText';
import './index.css';
import GDisk from "../Shape/Path/GDisk";

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
            id: 'item-menu-bar',
            tagName: 'div',
            classList:['item-menu-bar']
        });

        const buttonInfos = [
            {
                name: 'hand',
                icon: HAND_GRAB,
                iconSize: { width: '35', height: '35' },
                cursorType: 'grab'
            },
            {
                name: 'mouse',
                icon: MOUSE_CURSOR,
                iconSize: { width: '35', height: '35' },
                relatedBorder: Border
            },
            {
                name: 'text',
                content: 'Text',
                cursorType: 'crosshair',
                relatedBorder: CreateBorder,
                relatedClass: GText
            },
            {
                name: 'terminal',
                icon: TERMINAL_ICON,
                iconSize: { width: '34', height: '18' },
                cursorType: 'crosshair',
                relatedBorder: CreateBorder,
                relatedClass: GTerminal
            },
            {
                name: 'ready',
                icon: READY_ICON,
                iconSize: { width:'34', height: '18' },
                cursorType: 'crosshair',
                relatedBorder: CreateBorder,
                relatedClass: GReady
            },
            {
                name: 'process',
                icon: PROCESS_ICON,
                iconSize: { width: '34', height: '18'},
                cursorType: 'crosshair',
                relatedBorder: CreateBorder,
                relatedClass: GProcess
            },
            {
                name: 'judgment',
                icon: JUDGMENT_ICON,
                iconSize: { width:'34', height:'18' },
                cursorType: 'crosshair',
                relatedBorder: CreateBorder,
                relatedClass: GJudgment
            },
            {
                name: 'line',
                icon: LINE_ICON,
                iconSize: { width:'34', height:'10' },
                cursorType: 's-resize'
            },
            {
                name: 'ployline',
                icon: POLYLINE_ICON,
                iconSize: { width:'34', height:'45' },
                cursorType: 's-resize'
            },
            {
                name: 'pageconn',
                icon: PAGECONN_ICON,
                iconSize: { width: '40', height: '40' },
                cursorType: 'crosshair',
                relatedBorder: CreateBorder,
                relatedClass: GPageconn
            },
            {
                name: 'doc',
                icon: DOCUMENT_ICON,
                iconSize: { width: '35', height: '35' },
                cursorType: 'crosshair',
                relatedBorder: CreateBorder,
                relatedClass: GDocument
            },
            {
                name: 'disk',
                icon: DISK_ICON,
                iconSize: { width: '35', height: '35' },
                cursorType: 'crosshair',
                relatedBorder: CreateBorder,
                relatedClass: GDisk
            },
            {
                name: 'io',
                icon: IO_ICON,
                iconSize: { width: '34', height: '18' },
                cursorType: 'crosshair',
                relatedBorder: CreateBorder,
                relatedClass: GInputoutput
            },
            {
                name: 'pinput',
                icon: PINPUT_ICON,
                iconSize: { width: '34', height: '34' },
                cursorType: 'crosshair',
                relatedBorder: CreateBorder,
                relatedClass: GPinput
            }
        ];

        const createButton = ({ name, content, icon, iconSize, cursorType, relatedBorder = null, relatedClass = null}) => {
            const button =  new CustomButton({
                parentId: this.id,
                id: `item-${name}-btn`,
                content: content || `<img src='data:image/svg+xml;base64,${icon}' style='pointer-events: none;' width=${iconSize.width} height=${iconSize.height} />`,
                classList: ['item-btn',`item-${name}-btn`],
                cursorType,
                handlers: {
                    clickHandler: (e) => {
                        const repository = ComponentRepository.getInstance();
                        const selected = repository.getComponentById(e.target.id);
                        this.selectMenu = selected;
                    }
                }
            });
            button.name = name;
            button.relatedBorder = relatedBorder;
            button.relatedClass = relatedClass;

            return button;
        }

        const registerButton = (button) => {
            if(button.name === 'hand' || button.name === 'mouse' || button.name === 'text'){
                this[`${button.name}Btn`] = button;
            }else{
                this[`${button.name}GBtn`] = button;
            }
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
    const repository = ComponentRepository.getInstance();
    const style = repository.getComponentById('board').elem.getAttribute('style');
    repository.getComponentById('board').elem.setAttribute('style',style+`cursor:${type};`)
}