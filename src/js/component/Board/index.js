import ComponentRepository from '../../service/ComponentRepository';
import GraphicElement from '../GraphicElement';
import Group from '../Group';
import GText from '../GText';
import {tinyGUID} from '../../service/util';
import SizeBorder from '../SizeBorder';
import EventController from '../../service/EventController';
import TransformManager from '../../service/TransformManager';
import Line from '../Line';
import GLine from '../Line/GLine';
import GPolyline from '../Line/GPolyline';
import './index.css';
import {
    BOARD_ID,
    BORDER_GROUP_ID,
    BORDER_ID, COLOR_ORANGE, HISTORY_MENU_BAR_ID,
    ITEM_MENU_BAR_ID, PAGE_MENU_BAR_ID, PLACE_HOLDER_ID,
    SHAPE_GROUP_ID, STYLE_MENU_BAR_ID,
    TEMP_GROUP_ID
} from '../../service/constant';

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
                id: BORDER_GROUP_ID,
                propsName: 'borderGroup'
            },
            {
                id: SHAPE_GROUP_ID,
                propsName: 'shapeGroup'
            },
            {
                id: TEMP_GROUP_ID,
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
        const itemMenubar = ComponentRepository.getComponentById(ITEM_MENU_BAR_ID);
        let selected = null;
        if(itemMenubar.selectMenu){
            selected = ComponentRepository.getComponentById(itemMenubar.selectMenu);

            if(selected.id === itemMenubar.handBtn.id){
                this.mouseDownHandlerForHand(e);
            }

            //드래그하여 테두리 생성하는 경우
            if(selected.relatedBorder){
                this.createBorder(e, selected.relatedBorder, this.createShapePlaceHolder(selected.relatedClass));
            }

            if(selected?.relatedClass?.prototype instanceof Line){
                this.mouseDownHandlerForLine({ e, selected, itemMenubar });
            }
        }

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

            if(itemMenubar.selectMenu === itemMenubar.mouseBtn.id){
                if(this.border instanceof SizeBorder) return;
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
                Board.startPoint.clickCount = 1;
            }
            if(selected.relatedClass === GPolyline) {
                EventController.dbClickHandler = finish;
            }
        }else {
            Board.startPoint.lineplaceholder.addPoint({ x, y });
            Board.startPoint.line.addPoint({ x, y });

            if(++Board.startPoint.clickCount === 2){
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
            x: e.pageX,
            y: e.pageY
        };
        linePlaceHolder.render();
    }

    createBorder(e ,type, shape = null) {
        Board.startPoint.x = e.pageX;
        Board.startPoint.y = e.pageY;
        this.border = new type({
            parentId: this.tempGroup.id,
            id: BORDER_ID,
            shape
        });
        this.border.x = Board.startPoint.x;
        this.border.y = Board.startPoint.y;
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
        if(placeholder) placeholder.parentNode.removeChild(placeholder);
        this.tempGroup.elem.innerHTML = '';
        this.border = null;
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
        placeholder.line.elem.setAttribute('stroke',COLOR_ORANGE);
        placeholder.arrow?.elem.setAttribute('fill',COLOR_ORANGE);
        placeholder.line.elem.setAttribute('stroke-dasharray', '6');
        placeholder.line.elem.setAttribute('class', 'place-holder');
        return placeholder;
    }

    createShape(type) {
        return new type({
            parentId: this.shapeGroup.id,
            id: tinyGUID(),
            x: this.border.x,
            y: this.border.y,
            width: this.border.width,
            height: this.border.height
        });
    }

    createLine(type) {
        return new type({
           parentId: this.shapeGroup.id,
           id: tinyGUID(),
           startX: Board.startPoint.x,
           startY: Board.startPoint.y,
        });
    }
}

function setDisablePointerEvent(disable) {
    let menuBar = [ PAGE_MENU_BAR_ID,
        ITEM_MENU_BAR_ID,
        STYLE_MENU_BAR_ID,
        HISTORY_MENU_BAR_ID];

    menuBar = menuBar.map(id => ComponentRepository.getComponentById(id));

    if(disable){
        menuBar.forEach(menu => menu.elem.classList.add('disable-pointer-event'));
    } else {
        menuBar.forEach(menu => menu.elem.classList.remove('disable-pointer-event'));
    }
}