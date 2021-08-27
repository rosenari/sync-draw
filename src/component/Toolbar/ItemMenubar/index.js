import CustomElement from '../../CommonElement/CustomElement';
import { Board, CommonElements, Shapes, Borders  } from '../../index';
import { Service } from '../../../service';
import {
    DISK_ICON, DOCUMENT_ICON, HAND_GRAB, IO_ICON, JUDGMENT_ICON, LINE_ICON, MOUSE_CURSOR,
    PAGECONN_ICON, PINPUT_ICON, POLYLINE_ICON, PROCESS_ICON, READY_ICON, TERMINAL_ICON
} from '../../../images';
import { BEHAVIOR, BOARD_ID, BORDER, COLOR, COMPONENT_TYPE, CURSOR_TYPE, MENU_BAR } from '../../../service/constant';
import { setDisablePointerEvent } from '../../../service/util';
import './index.css';

export default class ItemMenubar extends CustomElement{
    board = null;
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

    constructor({parentId, board = Service.ComponentRepository.getComponentById(BOARD_ID)}) {
        super({
            parentId,
            id: MENU_BAR.ITEM_MENU_BAR_ID,
            tagName: 'div',
            classList:['item-menu-bar']
        });
        this.board = board;

        const buttonInfos = [
            {
                name: 'hand',
                icon: HAND_GRAB,
                iconSize: { width: '35', height: '35' },
                cursorType: CURSOR_TYPE.GRAB,
                relatedMouseDownHandler: (e) => {
                    board.destroyBorder();
                    Board.startPoint.x = e.pageX;
                    Board.startPoint.y = e.pageY;
                    Board.startPoint.translateX = Service.TransformManager.translateX;
                    Board.startPoint.translateY = Service.TransformManager.translateY;
                    Board.startPoint.moveX = Service.TransformManager.moveX;
                    Board.startPoint.moveY = Service.TransformManager.moveY;
                },
                relatedMouseMoveHandler: (e) => {
                    const dx = Board.startPoint.x - e.pageX;
                    const dy = Board.startPoint.y - e.pageY;

                    Service.TransformManager.moveX = Board.startPoint.moveX + dx;
                    Service.TransformManager.moveY = Board.startPoint.moveY + dy;
                    Service.TransformManager.translateX = Board.startPoint.translateX + dx;
                    Service.TransformManager.translateY = Board.startPoint.translateY + dy;
                },
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerCommon(e);
                }
            },
            {
                name: 'mouse',
                icon: MOUSE_CURSOR,
                iconSize: { width: '35', height: '35' },
                relatedBorder: Borders.DragBorder,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForMouseBtn(e);
                }
            },
            {
                name: 'text',
                content: 'Text',
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: Borders.CreateBorder,
                relatedClass: Shapes.GText,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForShape(e);
                }
            },
            {
                name: 'terminal',
                icon: TERMINAL_ICON,
                iconSize: { width: '34', height: '18' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: Borders.CreateBorder,
                relatedClass: Shapes.GTerminal,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForShape(e);
                }
            },
            {
                name: 'ready',
                icon: READY_ICON,
                iconSize: { width:'34', height: '18' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: Borders.CreateBorder,
                relatedClass: Shapes.GReady,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForShape(e);
                }
            },
            {
                name: 'process',
                icon: PROCESS_ICON,
                iconSize: { width: '34', height: '18'},
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: Borders.CreateBorder,
                relatedClass: Shapes.GProcess,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForShape(e);
                }
            },
            {
                name: 'judgment',
                icon: JUDGMENT_ICON,
                iconSize: { width:'34', height:'18' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: Borders.CreateBorder,
                relatedClass: Shapes.GJudgment,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForShape(e);
                }
            },
            {
                name: 'pageconn',
                icon: PAGECONN_ICON,
                iconSize: { width: '40', height: '40' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: Borders.CreateBorder,
                relatedClass: Shapes.GPageconn,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForShape(e);
                }
            },
            {
                name: 'doc',
                icon: DOCUMENT_ICON,
                iconSize: { width: '35', height: '35' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: Borders.CreateBorder,
                relatedClass: Shapes.GDocument,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForShape(e);
                }
            },
            {
                name: 'disk',
                icon: DISK_ICON,
                iconSize: { width: '35', height: '35' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: Borders.CreateBorder,
                relatedClass: Shapes.GDisk,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForShape(e);
                }
            },
            {
                name: 'io',
                icon: IO_ICON,
                iconSize: { width: '34', height: '18' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: Borders.CreateBorder,
                relatedClass: Shapes.GInputoutput,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForShape(e);
                }
            },
            {
                name: 'pinput',
                icon: PINPUT_ICON,
                iconSize: { width: '34', height: '34' },
                cursorType: CURSOR_TYPE.CROSSHAIR,
                relatedBorder: Borders.CreateBorder,
                relatedClass: Shapes.GPinput,
                relatedMouseDownHandler: this.mouseDownHandlerForHaveRelatedBorder,
                relatedMouseUpHandler: (e) => {
                    this.mouseUpHandlerForShape(e);
                }
            },
            {
                name: 'line',
                icon: LINE_ICON,
                iconSize: { width:'34', height:'10' },
                cursorType: CURSOR_TYPE.SRESIZE,
                relatedClass: Shapes.GLine,
                relatedMouseDownHandler: (e) => {
                    const x = e.pageX;
                    const y = e.pageY;
                    const finish = () => {
                        Service.HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.CREATE, type: COMPONENT_TYPE.GLine });
                        this.finishForLine();
                    }

                    if(!Board.startPoint.line) {
                        this.createLine({ x, y });
                        Board.startPoint.line.arrow.elem.setAttribute('stroke','transparent');
                    }else {
                        this.addLinePoint({ x, y });
                        Board.startPoint.line.arrow.elem.setAttribute('fill',COLOR.BLACK);
                        finish();
                    }
                },
                relatedMouseMoveHandler: (e) => {
                    this.mouseMoveHandlerForLine(e);
                }
            },
            {
                name: 'ployline',
                icon: POLYLINE_ICON,
                iconSize: { width:'34', height:'45' },
                cursorType: CURSOR_TYPE.SRESIZE,
                relatedClass: Shapes.GPolyline,
                relatedMouseDownHandler: (e) => {
                    const x = e.pageX;
                    const y = e.pageY;
                    const finish = () => {
                        const lastIndex = Board.startPoint.line.points.length - 1;
                        Board.startPoint.line.removePoint(lastIndex);
                        Service.HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.CREATE, type: COMPONENT_TYPE.GPolyline });
                        this.finishForLine();
                    }

                    if(!Board.startPoint.line) {
                        this.createLine({ x, y });
                        Service.EventController.dbClickHandler = finish;
                    }else {
                        this.addLinePoint({ x, y });
                    }
                },
                relatedMouseMoveHandler: (e) => {
                    this.mouseMoveHandlerForLine(e);
                }
            }
        ];

        const createButton = ({ name, content, icon, iconSize, cursorType, relatedBorder = null, relatedClass = null
                                  , relatedMouseDownHandler = null, relatedMouseMoveHandler = null, relatedMouseUpHandler = null }) => {
            const button =  new CommonElements.CustomButton({
                parentId: this.id,
                id: `item-${name}-btn`,
                content: content || `<img src='data:image/svg+xml;base64,${icon}' style='pointer-events: none;' width=${iconSize.width} height=${iconSize.height}  alt="loading" />`,
                classList: ['item-btn',`item-${name}-btn`],
                cursorType,
                handlers: {
                    clickHandler: (e) => {
                        this.board.destroyBorder();
                        this.selectMenu = Service.ComponentRepository.getComponentById(e.target.id);
                    }
                }
            });
            button.name = name;
            button.relatedBorder = relatedBorder;
            button.relatedClass = relatedClass;
            button.relatedMouseDownHandler = relatedMouseDownHandler;
            button.relatedMouseMoveHandler = relatedMouseMoveHandler;
            button.relatedMouseUpHandler = relatedMouseUpHandler;

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

    mouseDownHandlerForHaveRelatedBorder = (e, selected = Service.ComponentRepository.getComponentById(this.selectMenu)) => {
        if(this.board.border && this.board.border instanceof Borders.GroupBorder) return;

        this.board.createBorder(e, selected.relatedBorder, this.board.createShapePlaceHolder(selected.relatedClass));
    }

    mouseMoveHandlerForLine(e) {
        const linePlaceHolder = Board.startPoint.lineplaceholder;
        linePlaceHolder.points[linePlaceHolder.points.length - 1] = {
            x: Service.TransformManager.changeDocXToSvgX(e.pageX),
            y: Service.TransformManager.changeDocYToSvgY(e.pageY)
        };
        linePlaceHolder.render();
    }

    mouseUpHandlerCommon = (e, shape = null) =>{
        this.board.destroyBorder(e);
        shape?.clickHandler?.();
        this.finishForMouseUpHandler();
    }

    mouseUpHandlerForMouseBtn = (e) => {
        if(this.board.border instanceof Borders.SizeBorder) return;

        if(this.board.border instanceof Borders.DragBorder && this.board.border.groupingShape()) {
            this.board.destroySpecificBorder([BORDER.DRAG_BORDER_ID]);
            this.finishForMouseUpHandler();
            return;
        }

        this.mouseUpHandlerCommon(e);
    }

    mouseUpHandlerForShape = (e, selected = Service.ComponentRepository.getComponentById(this.selectMenu)) => {
        const shape = this.board.createShape(selected.relatedClass);
        this.selectMenu = this.mouseBtn;

        this.mouseUpHandlerCommon(e, shape);
    }

    finishForLine(){
        this.selectMenu = this.mouseBtn;

        Board.startPoint = {};
        this.board.destroyBorder();
        setDisablePointerEvent(false);
        Service.EventController.dbClickHandler = null;
        Service.EventController.mouseMoveHandler = null;
    }

    finishForMouseUpHandler(){
        setDisablePointerEvent(false);
        Board.startPoint = {};
        Service.EventController.mouseMoveHandler = null;
        Service.EventController.mouseUpHandler = null;
    }

    createLine({ x, y, selected = Service.ComponentRepository.getComponentById(this.selectMenu) }){
        Board.startPoint.lineplaceholder = this.board.createLinePlaceHolder(selected.relatedClass);
        Board.startPoint.lineplaceholder.addPoint({ x, y });
        Board.startPoint.line = this.board.createLine(selected.relatedClass);
    }

    addLinePoint({ x, y }){
        Board.startPoint.lineplaceholder.addPoint({ x, y });
        Board.startPoint.line.addPoint({ x, y });
    }

    get selectMenu() {
        return this._selectMenu;
    }

    set selectMenu(value) {
        for(const key in this){
            if(this[key] instanceof CommonElements.CustomButton) this[key].elem.classList.remove('item-btn-active');
        }
        value.elem.classList.add('item-btn-active');
        this.board.changeCursor(value.cursorType);
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