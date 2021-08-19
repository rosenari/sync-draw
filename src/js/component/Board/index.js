import ComponentRepository from '../../service/ComponentRepository';
import {tinyGUID, setDisablePointerEvent} from '../../service/util';
import EventController from '../../service/EventController';
import HistoryManager from '../../service/HistoryManager';
import { GraphicElement, Group, GText } from '../../component';
import {
    BOARD_ID,
    BORDER,
    COLOR,
    MENU_BAR,
    PLACE_HOLDER_ID,
    GROUP, BEHAVIOR
} from '../../service/constant';
import SizeBorder from '../Border/SizeBorder';
import GroupBorder from '../Border/GroupBorder';
import LineBorder from '../Border/LineBorder';
import './index.css';

export default class Board extends GraphicElement {
    static startPoint = {};
    _shapeGroup = null;
    _tempGroup = null;
    _border = null;

    constructor({ parentId, content = '', classList, handlers = {}}) {
        super({ parentId, id: BOARD_ID, tagName: 'svg', content, classList, handlers});
        this.elem.setAttribute('style',`width: 100%; height: 100%;`);

        const groupList = [
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
            if(e.shiftKey) return;
            this._mouseDownHandler(e);
        });
    }

    get shapeGroup() {
        return this._shapeGroup;
    }

    set shapeGroup(value) {
        this._shapeGroup = value;
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

    _mouseDownHandler(e, itemMenubar = ComponentRepository.getComponentById(MENU_BAR.ITEM_MENU_BAR_ID)) {
        setDisablePointerEvent(true);
        Board.startPoint.x = e.pageX;
        Board.startPoint.y = e.pageY;
        let selected = null;
        if(itemMenubar.selectMenu) {
            selected = ComponentRepository.getComponentById(itemMenubar.selectMenu);
            selected.relatedMouseDownHandler(e);
        }

        //line생성이 종료된 경우 mouseBtn메뉴가 선택되기 떄문에 selected를 갱신할 필요가 있음.
        selected = ComponentRepository.getComponentById(itemMenubar.selectMenu);

        EventController.mouseMoveHandler = (e) => {
            this.renderBorder(e);
            selected.relatedMouseMoveHandler?.(e);
        }

        EventController.mouseUpHandler = (e) => {
            selected.relatedMouseUpHandler?.(e);
        }
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

    createGroupBorder({ x, y, width, height, shapes,
                          styleMenubar = ComponentRepository.getComponentById(MENU_BAR.STYLE_MENU_BAR_ID)}){
        this.border = new GroupBorder({
            parentId: this.tempGroup.id,
            id: BORDER.GROUP_BORDER_ID,
            x, y, width, height, shapes
        });

        styleMenubar.show();
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

        HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.CREATE, type:`${shape.type}` });

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

    renderBorder(e) {
        if(!this.border) return;

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

    destroyBorder(e, styleMenubar = ComponentRepository.getComponentById(MENU_BAR.STYLE_MENU_BAR_ID)) {
        const placeholder = this.shapeGroup.elem.querySelector('#placeholder');
        if(placeholder){
            ComponentRepository.removeComponentById(placeholder.id);
        }
        this.tempGroup.elem.childNodes.forEach(childNode => ComponentRepository.removeComponentById(childNode.id));
        this.tempGroup.elem.innerHTML = '';

        this.border = null;
        styleMenubar.hide();
    }

    destroySpecificBorder(borderIds){
        borderIds.forEach((borderId) => {
            ComponentRepository.removeComponentById(borderId);
        });
    }

    changeCursor(type){
        this.elem.setAttribute('style',`width:100%;height:100%;cursor:${type};`);
    }
}