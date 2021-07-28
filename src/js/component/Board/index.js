import ComponentRepository from '../../service/ComponentRepository';
import GraphicElement from '../GraphicElement';
import Group from '../Group';
import GText from '../GText';
import Border from '../Border';
import CreateBorder from '../CreateBorder';
import {tinyGUID} from '../../service/util';
import SizeBorder from '../SizeBorder';
import EventController from '../../service/EventController';
import GTerminal from '../Shape/Rect/GTerminal';
import GJudgment from '../Shape/Polygon/GJudgment';
import GReady from '../Shape/Polygon/GReady';
import GProcess from '../Shape/Rect/GProcess';
import GPageconn from '../Shape/Polygon/GPageconn';
import GDocument from '../Shape/Path/GDocument';
import GDisk from '../Shape/Path/GDisk';
import GInputoutput from '../Shape/Polygon/GInputoutput';
import GPinput from '../Shape/Polygon/GPinput';
import './index.css';

export default class Board extends GraphicElement{
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

    mouseDownHandler(e) {
        e.stopPropagation();
        setPointerEvent(true);
        const repository = ComponentRepository.getInstance();
        const itemMenubar = repository.getComponentById('item-menu-bar');
        if(itemMenubar.selectMenu === itemMenubar.mouseBtn.id){
            this.createBorder(e, Border);
        }
        if(itemMenubar.selectMenu === itemMenubar.textBtn.id){
            this.createBorder(e, CreateBorder);
        }
        if(itemMenubar.selectMenu === itemMenubar.terminalGBtn.id){
            this.createBorder(e, CreateBorder, this.createPlaceHolder(GTerminal));
        }
        if(itemMenubar.selectMenu === itemMenubar.judgmentGBtn.id){
            this.createBorder(e, CreateBorder, this.createPlaceHolder(GJudgment));
        }
        if(itemMenubar.selectMenu === itemMenubar.readyGBtn.id){
            this.createBorder(e, CreateBorder, this.createPlaceHolder(GReady));
        }
        if(itemMenubar.selectMenu === itemMenubar.processGBtn.id){
            this.createBorder(e, CreateBorder, this.createPlaceHolder(GProcess));
        }
        if(itemMenubar.selectMenu === itemMenubar.pageConnGBtn.id){
            this.createBorder(e, CreateBorder, this.createPlaceHolder(GPageconn));
        }
        if(itemMenubar.selectMenu === itemMenubar.docGBtn.id){
            this.createBorder(e, CreateBorder, this.createPlaceHolder(GDocument));
        }
        if(itemMenubar.selectMenu === itemMenubar.diskGBtn.id){
            this.createBorder(e, CreateBorder, this.createPlaceHolder(GDisk));
        }
        if(itemMenubar.selectMenu === itemMenubar.ioGBtn.id){
            this.createBorder(e, CreateBorder, this.createPlaceHolder(GInputoutput));
        }
        if(itemMenubar.selectMenu === itemMenubar.pInputGBtn.id){
            this.createBorder(e, CreateBorder, this.createPlaceHolder(GPinput));
        }

        EventController.mouseMoveHandler = (e) => {
            if(!this.border) return;

            this.renderBorder(e);
        }

        EventController.mouseUpHandler = (e) => {
            let target = null;
            if(itemMenubar.selectMenu === itemMenubar.mouseBtn.id){
                if(this.border instanceof SizeBorder) return;
            }
            if(itemMenubar.selectMenu === itemMenubar.textBtn.id){
                target = this.createShape(GText);
            }
            if(itemMenubar.selectMenu === itemMenubar.terminalGBtn.id){
                target = this.createShape(GTerminal);
            }
            if(itemMenubar.selectMenu === itemMenubar.judgmentGBtn.id){
                target = this.createShape(GJudgment);
            }
            if(itemMenubar.selectMenu === itemMenubar.readyGBtn.id){
                target = this.createShape(GReady);
            }
            if(itemMenubar.selectMenu === itemMenubar.processGBtn.id){
                target = this.createShape(GProcess);
            }
            if(itemMenubar.selectMenu === itemMenubar.pageConnGBtn.id){
                target = this.createShape(GPageconn);
            }
            if(itemMenubar.selectMenu === itemMenubar.docGBtn.id){
                target = this.createShape(GDocument);
            }
            if(itemMenubar.selectMenu === itemMenubar.diskGBtn.id){
                target = this.createShape(GDisk);
            }
            if(itemMenubar.selectMenu === itemMenubar.ioGBtn.id){
                target = this.createShape(GInputoutput);
            }
            if(itemMenubar.selectMenu === itemMenubar.pInputGBtn.id){
                target = this.createShape(GPinput);
            }

            this.destroyBorder(e);
            itemMenubar.selectMenu = itemMenubar.mouseBtn;
            target?.clickHandler?.();

            setPointerEvent(false);
            EventController.mouseMoveHandler = null;
            EventController.mouseUpHandler = null;
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

    createPlaceHolder(type){
        const placeholder =  new type({
            parentId: this.tempGroup.id,
            id: 'placeholder'
        });
        placeholder.elem.setAttribute('class','shape-place-holder');
        return placeholder;
    }

    createShape(type){
        return new type({
            parentId: this.shapeGroup.id,
            id: tinyGUID(),
            x: this.border.x,
            y: this.border.y,
            width: this.border.width,
            height: this.border.height
        });
    }
}

function setPointerEvent(disable){
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