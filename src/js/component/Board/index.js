import ComponentRepository from '../../service/ComponentRepository';
import {tinyGUID} from '../../service/util';
import SizeBorder from '../Border/SizeBorder';
import EventController from '../../service/EventController';
import TransformManager from '../../service/TransformManager';
import HistoryManager from '../../service/HistoryManager';
import { GraphicElement, Group, GText, Line, GLine, GPolyline } from '../../component';
import './index.css';
import {
    BOARD_ID,
    BORDER,
    COLOR,
    MENU_BAR,
    PLACE_HOLDER_ID,
    GROUP
} from '../../service/constant';
import DragBorder from '../Border/DragBorder';
import GroupBorder from '../Border/GroupBorder';
import LineBorder from '../Border/LineBorder';

export default class Board extends GraphicElement {
    static startPoint = {};
    _shapeGroup = null;
    _borderGroup = null;
    _tempGroup = null;
    _border = null;

    constructor({ parentId, content = '', classList, handlers = {}}) {
        super({ parentId, id: BOARD_ID, tagName: 'svg', content, classList, handlers});
        this.elem.setAttribute('style',`width: 100%; height: 100%;`);

        const groupList = [
            {
                id: GROUP.BORDER_GROUP_ID,
                propsName: 'borderGroup'
            },
            {
                id: GROUP.SHAPE_GROUP_ID,
                propsName: 'shapeGroup'
            },
            {
                id: GROUP.TEMP_GROUP_ID,
                propsName: 'tempGroup'
            }
        ];

        const registerGroup = (group) => {
            this[`${group.propsName}`] = new Group({
               parentId: this.id,
               id: group.id
            });
        }

        groupList.forEach(registerGroup);

        this.elem.addEventListener('mousedown',(e) => {
            this._mouseDownHandler(e);
        });
    }

    get shapeGroup() {
        return this._shapeGroup;
    }

    set shapeGroup(value) {
        this._shapeGroup = value;
    }

    get borderGroup() {
        return this._borderGroup;
    }

    set borderGroup(value) {
        this._borderGroup = value;
    }

    get tempGroup() {
        return this._tempGroup;
    }

    set tempGroup(value) {
        this._tempGroup = value;
    }

    get border() {
        return this._border;
    }

    set border(value) {
        this._border = value;
    }

    _mouseDownHandler(e) {
        setDisablePointerEvent(true);
        Board.startPoint.x = e.pageX;
        Board.startPoint.y = e.pageY;
        const itemMenubar = ComponentRepository.getComponentById(MENU_BAR.ITEM_MENU_BAR_ID);
        let selected = null;
        if(itemMenubar.selectMenu){
            selected = ComponentRepository.getComponentById(itemMenubar.selectMenu);

            if(selected.id === itemMenubar.handBtn.id){
                this.mouseDownHandlerForHand(e);
            }

            //드래그하여 테두리 생성하는 경우
            if(selected.relatedBorder && !(this.border instanceof GroupBorder)){
                this.createBorder(e, selected.relatedBorder, this.createShapePlaceHolder(selected.relatedClass));
            }

            if(selected?.relatedClass?.prototype instanceof Line){
                this.mouseDownHandlerForLine({ e, selected, itemMenubar });
            }
        }

        //line생성이 종료된 경우 mouseBtn메뉴가 선택되기 떄문에 selected를 갱신할 필요가 있음.
        selected = ComponentRepository.getComponentById(itemMenubar.selectMenu);

        EventController.mouseMoveHandler = (e) => {
            if(selected?.id === itemMenubar.handBtn.id){
                this.mouseMoveHandlerForHand(e);
            }

            if(this.border) {
                this.renderBorder(e);
            }

            if(selected?.relatedClass?.prototype instanceof Line){
                this.mouseMoveHandlerForLine(e);
            }
        }

        if(selected?.relatedClass?.prototype instanceof Line){
            return;
        }

        EventController.mouseUpHandler = (e) => {
            let shape = null;
            const finish = () => {
                setDisablePointerEvent(false);
                Board.startPoint = {};
                EventController.mouseMoveHandler = null;
                EventController.mouseUpHandler = null;
            }

            if(itemMenubar.selectMenu === itemMenubar.mouseBtn.id) {
                if(this.border instanceof SizeBorder) return;
                if(this.border instanceof DragBorder && this.border.groupingShape()) {
                    this.destroySpecificBorder([BORDER.DRAG_BORDER_ID]);
                    finish();
                    return;
                }
            }

            if(selected?.relatedClass) {
                shape = this.createShape(selected.relatedClass);

                itemMenubar.selectMenu = itemMenubar.mouseBtn;
            }

            this.destroyBorder(e);
            shape?.clickHandler?.();
            finish();
        }
    }

    mouseDownHandlerForHand(e) {
        this.destroyBorder();
        Board.startPoint.x = e.pageX;
        Board.startPoint.y = e.pageY;
        Board.startPoint.translateX = TransformManager.translateX;
        Board.startPoint.translateY = TransformManager.translateY;
        Board.startPoint.moveX = TransformManager.moveX;
        Board.startPoint.moveY = TransformManager.moveY;
    }

    mouseDownHandlerForLine({ e, selected, itemMenubar }) {
        const x = e.pageX;
        const y = e.pageY;
        const finish = () => {
            if(selected.relatedClass === GPolyline) {
                const lastIndex = Board.startPoint.line.points.length - 1;
                Board.startPoint.line.removePoint(lastIndex);
            }
            HistoryManager.updateHistoryToLatest({ behavior: 'create', type:`${Board.startPoint.line.type}` });

            itemMenubar.selectMenu = itemMenubar.mouseBtn;

            Board.startPoint = {};
            this.destroyBorder();
            setDisablePointerEvent(false);
            EventController.dbClickHandler = null;
            EventController.mouseMoveHandler = null;
        }

        if(!Board.startPoint.line) {
            Board.startPoint.lineplaceholder = this.createLinePlaceHolder(selected.relatedClass);
            Board.startPoint.lineplaceholder.addPoint({ x, y });
            Board.startPoint.line = this.createLine(selected.relatedClass);

            if(selected.relatedClass === GLine){
                Board.startPoint.line.arrow.elem.setAttribute('stroke','transparent');
            }

            if(selected.relatedClass === GPolyline) {
                EventController.dbClickHandler = finish;
            }
        }else {
            Board.startPoint.lineplaceholder.addPoint({ x, y });
            Board.startPoint.line.addPoint({ x, y });

            if(selected.relatedClass === GLine){
                Board.startPoint.line.arrow.elem.setAttribute('fill',COLOR.BLACK);
                finish();
            }
        }
    }

    mouseMoveHandlerForHand(e){
        const dx = Board.startPoint.x - e.pageX;
        const dy = Board.startPoint.y - e.pageY;

        TransformManager.moveX = Board.startPoint.moveX + dx;
        TransformManager.moveY = Board.startPoint.moveY + dy;
        TransformManager.translateX = Board.startPoint.translateX + dx;
        TransformManager.translateY = Board.startPoint.translateY + dy;
    }

    mouseMoveHandlerForLine(e){
        const linePlaceHolder = Board.startPoint.lineplaceholder;
        linePlaceHolder.points[linePlaceHolder.points.length - 1] = {
            x: TransformManager.changeDocXToSvgX(e.pageX),
            y: TransformManager.changeDocYToSvgY(e.pageY)
        };
        linePlaceHolder.render();
    }

    createBorder(e ,type, shape = null) {
        Board.startPoint.x = e.pageX;
        Board.startPoint.y = e.pageY;
        this.border = new type({
            parentId: this.tempGroup.id,
            id: BORDER.BORDER_ID,
            shape
        });
        this.border.x = Board.startPoint.x;
        this.border.y = Board.startPoint.y;
    }

    createGroupBorder({ x, y, width, height, shapes}){
        this.border = new GroupBorder({
            parentId: this.tempGroup.id,
            id: BORDER.GROUP_BORDER_ID,
            x, y, width, height, shapes
        });
    }

    renderBorder(e) {
        if(!Board.startPoint.x || !Board.startPoint.y) return;
        //이동한 변위
        const dx = e.pageX - Board.startPoint.x;
        const dy = e.pageY - Board.startPoint.y;
        //변화된 너비와와 높이
        let width = dx;
        let height = dy;
        let x = Board.startPoint.x;
        let y = Board.startPoint.y;

        if(width < 0){
            x += dx;
        }
        if(height < 0){
            y += dy;
        }

        this.border.x = x;
        this.border.y = y;
        this.border.width = Math.abs(width);
        this.border.height = Math.abs(height);
    }

    destroyBorder() {
        const placeholder = this.shapeGroup.elem.querySelector('#placeholder');
        const styleMenubar = ComponentRepository.getComponentById(MENU_BAR.STYLE_MENU_BAR_ID);
        if(placeholder){
            placeholder.parentNode.removeChild(placeholder);
            ComponentRepository.removeComponentById(placeholder.id);
        }
        this.tempGroup.elem.innerHTML = '';
        this.border = null;
        styleMenubar.hide();
    }

    destroySpecificBorder(borderIds){
        borderIds.forEach((borderId) => {
            document.getElementById(borderId)?.remove();
        });
    }

    createShapePlaceHolder(type) {
        if(!type || type === GText) return null;

        const placeholder =  new type({
            parentId: this.shapeGroup.id,
            id: PLACE_HOLDER_ID
        });
        placeholder.elem.setAttribute('class','place-holder');
        return placeholder;
    }

    createLinePlaceHolder(type) {
        const placeholder = new type({
            parentId: this.shapeGroup.id,
            id: PLACE_HOLDER_ID,
            startX: Board.startPoint.x,
            startY: Board.startPoint.y
        });
        placeholder.line.elem.setAttribute('stroke',COLOR.ORANGE);
        placeholder.arrow?.elem.setAttribute('stroke','transparent');
        placeholder.arrow?.elem.setAttribute('fill',COLOR.ORANGE);
        placeholder.line.elem.setAttribute('stroke-dasharray', '6');
        placeholder.line.elem.setAttribute('class', 'place-holder');
        return placeholder;
    }

    createShape(type) {
        const shape = new type({
            parentId: this.shapeGroup.id,
            id: tinyGUID(),
            x: this.border.x,
            y: this.border.y,
            width: this.border.width,
            height: this.border.height
        });

        HistoryManager.updateHistoryToLatest({ behavior: 'create', type:`${shape.type}` });

        return shape;
    }

    createLine(type) {
        return new type({
           parentId: this.shapeGroup.id,
           id: tinyGUID(),
           startX: Board.startPoint.x,
           startY: Board.startPoint.y,
        });
    }

    createSizeBorder(target){
        this.border = new SizeBorder({
            parentId: GROUP.TEMP_GROUP_ID,
            target
        });
    }

    createLineBorder(target){
        this.border = new LineBorder({
            parentId: GROUP.TEMP_GROUP_ID,
            target
        });
    }
}

function setDisablePointerEvent(disable) {
    const menuBar = [ MENU_BAR.PAGE_MENU_BAR_ID,
        MENU_BAR.ITEM_MENU_BAR_ID,
        MENU_BAR.STYLE_MENU_BAR_ID,
        MENU_BAR.HISTORY_MENU_BAR_ID].map(id => ComponentRepository.getComponentById(id));

    if(disable){
        menuBar.forEach(menu => menu.elem.classList.add('disable-pointer-event'));
    } else {
        menuBar.forEach(menu => menu.elem.classList.remove('disable-pointer-event'));
    }
}