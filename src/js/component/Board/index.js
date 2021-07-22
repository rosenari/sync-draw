import ComponentRepository from '../../service/ComponentRepository';
import GraphicElement from '../GraphicElement';
import Group from '../Group';
import GText from '../GText';
import Border from '../Border';
import CreateBorder from '../CreateBorder';
import {tinyGUID} from '../../service/util';

export default class Board extends GraphicElement{
    static startPoint = {};
    _shapeGroup = null;
    _borderGroup = null;
    _tempGroup = null;
    _border = null;

    constructor({ parentId, content = '', classList, handlers = {}}) {
        super({ parentId, id: 'board', tagName: 'svg', content, classList, handlers});
        this.elem.setAttribute('style',`width: 100%; height: 100%;`);

        this.shapeGroup = new Group({
            parentId:this.id,
            id:'shape-group'
        });

        this.borderGroup = new Group({
            parentId:this.id,
            id:'border-group'
        });

        this.tempGroup = new Group({
            parentId:this.id,
            id:'temp-group'
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

    }

    mouseDownHandler(e) {
        e.stopPropagation();
        const repository = ComponentRepository.getInstance();
        const itemMenubar = repository.getComponentById('item-menu-bar');
        if(itemMenubar.selectMenu === itemMenubar.mouseBtn.id){
            this.createBorder(e, Border);
        }
        if(itemMenubar.selectMenu === itemMenubar.textBtn.id){
            this.createBorder(e, CreateBorder);
        }
    }

    mouseMoveHandler(e) {
        const repository = ComponentRepository.getInstance();
        const itemMenubar = repository.getComponentById('item-menu-bar');
        if(itemMenubar.selectMenu === itemMenubar.mouseBtn.id){
            this.renderBorder(e);
        }
        if(itemMenubar.selectMenu === itemMenubar.textBtn.id){
            this.renderBorder(e);
        }
    }

    mouseUpHandler(e) {
        const repository = ComponentRepository.getInstance();
        const itemMenubar = repository.getComponentById('item-menu-bar');
        if(itemMenubar.selectMenu === itemMenubar.mouseBtn.id){
            this.destroyBorder(e);
        }
        if(itemMenubar.selectMenu === itemMenubar.textBtn.id){
            this.createGText();
            this.destroyBorder(e);
            itemMenubar.selectMenu = itemMenubar.mouseBtn;
        }
    }

    createBorder(e ,type, shape = null){
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

    renderBorder(e){
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

    destroyBorder(e){
        Board.startPoint = {};
        this.tempGroup.elem.innerHTML = '';
        this.border = null;
    }

    createGText(){
        new GText({
            parentId: this.shapeGroup.id,
            id: tinyGUID(),
            x: this.border.x,
            y: this.border.y,
            width: this.border.width,
            height: this.border.height
        });
    }
}