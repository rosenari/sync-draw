import ComponentRepository from '../../service/ComponentRepository';
import GraphicElement from '../GraphicElement';
import Group from '../Group';
import GText from '../GText';
import {tinyGUID} from '../../service/util';
import SizeBorder from '../SizeBorder';
import EventController from '../../service/EventController';
import TransformManager from '../../service/TransformManager';
import './index.css';

export default class Board extends GraphicElement {
    static startPoint = {};
    _shapeGroup = null;
    _borderGroup = null;
    _tempGroup = null;
    _border = null;

    constructor({ parentId, content = '', classList, handlers = {}}) {
        super({ parentId, id: 'board', tagName: 'svg', content, classList, handlers});
        this.elem.setAttribute('style',`width: 100%; height: 100%;`);

        this.borderGroup = new Group({
            parentId:this.id,
            id:'border-group'
        });

        this.shapeGroup = new Group({
            parentId:this.id,
            id:'shape-group'
        });

        this.tempGroup = new Group({
            parentId:this.id,
            id:'temp-group'
        });

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

    clickHandler(e) {
        //this.destroyBorder();
    }

    _mouseDownHandler(e) {
        setPointerEvent(true);
        Board.startPoint.x = e.pageX;
        Board.startPoint.y = e.pageY;
        const repository = ComponentRepository.getInstance();
        const itemMenubar = repository.getComponentById('item-menu-bar');
        let selected = null;
        if(itemMenubar.selectMenu){
            selected = repository.getComponentById(itemMenubar.selectMenu);
            if(selected.relatedBorder){
                this.createBorder(e, selected.relatedBorder, this.createShapePlaceHolder(selected.relatedClass));
            }

            if(selected.id === itemMenubar.lineGBtn.id){
                if(!Board.startPoint.line) {
                    Board.startPoint.clickCount = 1;
                    Board.startPoint.lineplaceholder = this.createLinePlaceHolder(selected.relatedClass);
                    Board.startPoint.lineplaceholder.addPoint({
                        x: e.pageX,
                        y: e.pageY
                    });
                    Board.startPoint.line = this.createLine(selected.relatedClass);
                }else {
                    Board.startPoint.line.addPoint({
                        x: e.pageX,
                        y: e.pageY
                    });
                    Board.startPoint.lineplaceholder.addPoint({
                        x: e.pageX,
                        y: e.pageY
                    });

                    if(++Board.startPoint.clickCount === 2){
                        Board.startPoint = {};
                        EventController.mouseMoveHandler = null;
                        setPointerEvent(false);
                        this.destroyBorder();
                        itemMenubar.selectMenu = itemMenubar.mouseBtn;
                        return;
                    }
                }
            }

            if(selected.id === itemMenubar.ploylineGBtn.id){
                if(!Board.startPoint.line) {
                    Board.startPoint.lineplaceholder = this.createLinePlaceHolder(selected.relatedClass);
                    Board.startPoint.lineplaceholder.addPoint({
                        x: e.pageX,
                        y: e.pageY
                    });
                    Board.startPoint.line = this.createLine(selected.relatedClass);

                    EventController.dbClickHandler = (e) => {
                        Board.startPoint = {};
                        setPointerEvent(false);
                        this.destroyBorder();
                        itemMenubar.selectMenu = itemMenubar.mouseBtn;
                        EventController.mouseMoveHandler = null;
                        EventController.dbClickHandler = null;
                        return;
                    }
                }else {
                    Board.startPoint.line.addPoint({
                        x: e.pageX,
                        y: e.pageY
                    });
                    Board.startPoint.lineplaceholder.addPoint({
                        x: e.pageX,
                        y: e.pageY
                    });
                }
            }

            if(selected.id === itemMenubar.handBtn.id){
                this.destroyBorder();
                Board.startPoint.translateX = TransformManager.translateX;
                Board.startPoint.translateY = TransformManager.translateY;
                Board.startPoint.moveX = TransformManager.moveX;
                Board.startPoint.moveY = TransformManager.moveY;
            }
        }

        EventController.mouseMoveHandler = (e) => {
            if(selected?.id === itemMenubar.handBtn.id){
                const dx = Board.startPoint.x - e.pageX;
                const dy = Board.startPoint.y - e.pageY;

                TransformManager.moveX = Board.startPoint.moveX + dx;
                TransformManager.moveY = Board.startPoint.moveY + dy;
                TransformManager.translateX = Board.startPoint.translateX + dx;
                TransformManager.translateY = Board.startPoint.translateY + dy;
            }
            if(selected?.id === itemMenubar.lineGBtn.id || selected?.id === itemMenubar.ploylineGBtn.id){
                const lineplaceholder = Board.startPoint.lineplaceholder;
                lineplaceholder.points[lineplaceholder.points.length - 1] = {
                    x: e.pageX,
                    y: e.pageY
                };
                lineplaceholder.render();
            }

            if(!this.border) return;

            this.renderBorder(e);
        }

        if(selected?.id === itemMenubar.lineGBtn.id){
            return;
        }
        if(selected?.id === itemMenubar.ploylineGBtn.id){
            return;
        }

        EventController.mouseUpHandler = (e) => {
            let target = null;
            if(itemMenubar.selectMenu === itemMenubar.handBtn.id){
                setPointerEvent(false);
                Board.startPoint = {};
                EventController.mouseMoveHandler = null;
                EventController.mouseUpHandler = null;
                return;
            }
            if(itemMenubar.selectMenu === itemMenubar.mouseBtn.id){
                if(this.border instanceof SizeBorder) return;
            }
            const selected = repository.getComponentById(itemMenubar.selectMenu);
            if(selected?.relatedClass) {
                target = this.createShape(selected.relatedClass);
            }

            this.destroyBorder(e);
            itemMenubar.selectMenu = itemMenubar.mouseBtn;
            target?.clickHandler?.();

            setPointerEvent(false);
            EventController.mouseMoveHandler = null;
            EventController.mouseUpHandler = null;
        }
    }

    createBorder(e ,type, shape = null) {
        Board.startPoint.x = e.pageX;
        Board.startPoint.y = e.pageY;
        this.border = new type({
            parentId: this.tempGroup.id,
            id: 'border',
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

    destroyBorder(e) {
        Board.startPoint = {};
        //placeholder 제거
        const placeholder = this.shapeGroup.elem.querySelector('#placeholder');
        if(placeholder) placeholder.parentNode.removeChild(placeholder);
        this.tempGroup.elem.innerHTML = '';
        this.border = null;
    }

    createShapePlaceHolder(type) {
        if(!type || type === GText) return null;

        const placeholder =  new type({
            parentId: this.shapeGroup.id,
            id: 'placeholder'
        });
        placeholder.elem.setAttribute('class','place-holder');
        return placeholder;
    }

    createLinePlaceHolder(type) {
        const placeholder = new type({
            parentId: this.shapeGroup.id,
            id: 'placeholder',
            startX: Board.startPoint.x,
            startY: Board.startPoint.y
        });
        placeholder.line.elem.setAttribute('stroke','orange');
        placeholder.arrow?.elem.setAttribute('fill','orange');
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

function setPointerEvent(disable) {
    const repository = ComponentRepository.getInstance();
    const menuBar = [ repository.getComponentById('page-menu-bar'),
        repository.getComponentById('item-menu-bar'),
        repository.getComponentById('style-menu-bar'),
    repository.getComponentById('history-menu-bar')];

    if(disable){
        menuBar.forEach(menu => menu.elem.classList.add('disable-pointer-event'));
    } else {
        menuBar.forEach(menu => menu.elem.classList.remove('disable-pointer-event'));
    }
}