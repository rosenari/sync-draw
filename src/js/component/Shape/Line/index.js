import Shape from '../index';
import GraphicElement from '../../GraphicElement';
import {BOARD_ID, COLOR, GROUP, MENU_BAR} from '../../../service/constant';
import ComponentRepository from '../../../service/ComponentRepository';
import LineBorder from '../../Border/LineBorder';
import TransformManager from '../../../service/TransformManager';

class Line extends Shape {
    _points = [];
    _line = null;

    constructor({ parentId, id, startX, startY, classList, handlers}) {
        super({
            parentId,
            id,
            tagName: 'g',
            classList,
            handlers
        });

        this.line = new GraphicElement({
            parentId: this.id,
            id: id + '_line',
            tagName: 'polyline',
            handlers: {
                clickHandler: () => {
                    this.clickHandler();
                }
            }
        });

        this.addPoint({
            x: startX,
            y: startY
        });

        this.elem.setAttribute('fill','transparent');
        this.line.elem.setAttribute('stroke', COLOR.BLACK);
        this.line.elem.setAttribute('stroke-width', '3');
        this.line.elem.setAttribute('style','cursor:move;')
    }

    render() {
        const pointsStr = [...this.points].map(({ x, y }) => `${x} ${y}`).join(', ');

        this.line.elem.setAttribute('points',pointsStr);
    }

    get x(){
        return [...this.points].sort((pointA, pointB) => {
            return pointA.x - pointB.x;
        })[0] || 0;
    }

    set x(value){
        const minX = this.x;
        const dx = value - minX;
        this.points.map(point => {
            return {
                ...point,
                x: point.x + dx
            }
        });
        this.render();
    }

    get y(){
        return [...this.points].sort((pointA, pointB) => {
            return pointA.y - pointB.y;
        })[0] || 0;
    }

    set y(value){
        const minY = this.y;
        const dy = value - minY;
        this.points.map(point => {
           return {
               ...point,
               y: point.y + dy
           }
        });
    }

    get line() {
        return this._line;
    }

    set line(value) {
        this._line = value;
    }

    get points(){
        return this._points;
    }

    set points(value){
        this._points = value;
        this.render();
    }

    addPoint({ x, y }){
        this.points.push({
            x, y
        });
        this.render();
    }

    removePoint(index) {
        this.points.splice(index,1);
        this.render();
    }

    clickHandler(e) {
        const board = ComponentRepository.getComponentById(BOARD_ID);
        const itemMenubar = ComponentRepository.getComponentById(MENU_BAR.ITEM_MENU_BAR_ID);
        if(ComponentRepository.getComponentById(itemMenubar.selectMenu).name !== 'mouse'){
            return;
        }

        this.elem.parentNode?.appendChild?.(this.elem);

        board.destroyBorder();
        board.border = new LineBorder({
            parentId: GROUP.TEMP_GROUP_ID,
            target: this
        });
    }
}

export default TransformManager.wrapLine(Line);