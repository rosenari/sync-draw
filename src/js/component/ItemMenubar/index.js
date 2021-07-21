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
    _ployLineGBtn = null; //직선 요소 탭
    _pageConnGBtn = null; //페이지 연결자 요소 탭
    _docGBtn = null; //서류 요소 탭
    _diskGBtn = null; //디스크 요소 탭
    _ioGBtn = null; //입출력 요소 탭
    _pInputGBtn = null; //수동입력 요소 탭

    constructor({parentId}) {
        super({
            parentId,
            id: 'item-menu-bar',
            tagName: 'div',
            classList:['item-menu-bar']
        });

        this.handBtn = new CustomButton({
            parentId: this.id,
            id: 'item-hand-btn',
            content: `<img src='data:image/svg+xml;base64,${HAND_GRAB}' style='pointer-events: none;' width='35' height='35' />`,
            classList:['item-btn','item-hand-btn'],
            cursorType: 'grab',
            handlers:{
                clickHandler: (e) => {
                    this.selectMenu = this.handBtn;
                }
            }
        });

        this.mouseBtn = new CustomButton({
            parentId: this.id,
            id: 'item-mouse-btn',
            content: `<img src='data:image/svg+xml;base64,${MOUSE_CURSOR}' style='pointer-events: none;' width='35' height='35' />`,
            classList: ['item-btn','item-mouse-btn'],
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.mouseBtn;
                }
            }
        });

        this.textBtn = new CustomButton({
            parentId: this.id,
            id: 'item-text-btn',
            content: 'Text',
            classList: ['item-btn','item-text-btn'],
            cursorType: 'crosshair',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.textBtn;
                }
            }
        });

        this.terminalGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-terminal-btn',
            content: `<img src='data:image/svg+xml;base64,${TERMINAL_ICON}' style='pointer-events: none;' width='34' height='18' />`,
            classList: ['item-btn','item-terminal-btn'],
            cursorType: 'crosshair',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.terminalGBtn;
                }
            }
        });

        this.readyGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-ready-btn',
            content: `<img src='data:image/svg+xml;base64,${READY_ICON}' style='pointer-events: none;' width='34' height='18' />`,
            classList: ['item-btn','item-ready-btn'],
            cursorType: 'crosshair',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.readyGBtn;
                }
            }
        });

        this.processGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-process-btn',
            content: `<img src='data:image/svg+xml;base64,${PROCESS_ICON}' style='pointer-events: none;' width='34' height='18' />`,
            classList: ['item-btn','item-process-btn'],
            cursorType: 'crosshair',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.processGBtn;
                }
            }
        });

        this.judgmentGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-judgment-btn',
            content: `<img src='data:image/svg+xml;base64,${JUDGMENT_ICON}' style='pointer-events: none;' width='34' height='18' />`,
            classList: ['item-btn','item-judgment-btn'],
            cursorType: 'crosshair',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.judgmentGBtn;
                }
            }
        });

        this.lineGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-line-btn',
            content: `<img src='data:image/svg+xml;base64,${LINE_ICON}' style='pointer-events: none;' width='34' height='10' />`,
            classList: ['item-btn','item-line-btn'],
            cursorType: 's-resize',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.lineGBtn;
                }
            }
        });

        this.ployLineGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-polyline-btn',
            content: `<img src='data:image/svg+xml;base64,${POLYLINE_ICON}' style='pointer-events: none;' width='34' height='45' />`,
            classList: ['item-btn','item-polyline-btn'],
            cursorType: 's-resize',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.ployLineGBtn;
                }
            }
        });

        this.pageConnGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-pageconn-btn',
            content: `<img src='data:image/svg+xml;base64,${PAGECONN_ICON}' style='pointer-events: none;' width='40' height='40' />`,
            classList: ['item-btn','item-pageconn-btn'],
            cursorType: 'crosshair',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.pageConnGBtn;
                }
            }
        });

        this.docGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-doc-btn',
            content: `<img src='data:image/svg+xml;base64,${DOCUMENT_ICON}' style='pointer-events: none;' width='35' height='35' />`,
            classList: ['item-btn','item-doc-btn'],
            cursorType: 'crosshair',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.docGBtn;
                }
            }
        });

        this.diskGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-disk-btn',
            content: `<img src='data:image/svg+xml;base64,${DISK_ICON}' style='pointer-events: none;' width='35' height='35' />`,
            classList: ['item-btn','item-disk-btn'],
            cursorType: 'crosshair',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.diskGBtn;
                }
            }
        });

        this.ioGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-io-btn',
            content: `<img src='data:image/svg+xml;base64,${IO_ICON}' style='pointer-events: none;' width='34' height='18' />`,
            classList: ['item-btn','item-io-btn'],
            cursorType: 'crosshair',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.ioGBtn;
                }
            }
        });

        this.pInputGBtn = new CustomButton({
            parentId: this.id,
            id: 'item-pinput-btn',
            content: `<img src='data:image/svg+xml;base64,${PINPUT_ICON}' style='pointer-events: none;' width='34' height='34' />`,
            classList: ['item-btn','item-pinput-btn'],
            cursorType: 'crosshair',
            handlers: {
                clickHandler: (e) => {
                    this.selectMenu = this.pInputGBtn;
                }
            }
        });

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

    get ployLineGBtn() {
        return this._ployLineGBtn;
    }

    get pageConnGBtn() {
        return this._pageConnGBtn;
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

    get pInputGBtn() {
        return this._pInputGBtn;
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

    set ployLineGBtn(value) {
        this._ployLineGBtn = value;
    }

    set pageConnGBtn(value) {
        this._pageConnGBtn = value;
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

    set pInputGBtn(value) {
        this._pInputGBtn = value;
    }
}

function changeCursor(type){
    const repository = ComponentRepository.getInstance();
    const style = repository.getComponentById('board').elem.getAttribute('style');
    repository.getComponentById('board').elem.setAttribute('style',style+`cursor:${type};`)
}