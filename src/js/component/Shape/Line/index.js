import Shape from '../index';
import GraphicElement from '../../CommonElement/GraphicElement';
import {BOARD_ID, COLOR, MENU_BAR} from '../../../service/constant';
import ComponentRepository from '../../../service/ComponentRepository';
import TransformManager from '../../../service/TransformManager';

class Line extends Shape {
    _points = [];
    _line = null;
    board = null;
    itemMenubar = null;
    styleMenubar = null;


    constructor({ parentId, id, startX, startY, classList, handlers,
        board = ComponentRepository.getComponentById(BOARD_ID),
        itemMenubar = ComponentRepository.getComponentById(MENU_BAR.ITEM_MENU_BAR_ID),
        styleMenubar = ComponentRepository.getComponentById(MENU_BAR.STYLE_MENU_BAR_ID)}) {
        super({
            parentId,
            id,
            tagName: 'g',
            classList,
            handlers
        });
        this.board = board;
        this.styleMenubar = styleMenubar;
        this.itemMenubar = itemMenubar;

        this.line = new GraphicElement({
            parentId: this.id,
            id: id + '_line',
            tagName: 'polyline',
            handlers: {
                clickHandler: (e) => {
                    this.clickHandler(e);
                }
            }
        });

        if(startX && startY) this.addPoint({
            x: startX,
            y: startY
        });

        this.elem.setAttribute('fill','transparent');
        this.strokeColor =  COLOR.BLACK;
        this.line.elem.setAttribute('stroke-width', '3');
        this.line.elem.setAttribute('style','cursor:move;')
    }

    render() {
        const pointsStr = [...this.points].map(({ x, y }) => `${x} ${y}`).join(', ');

        this.line.elem.setAttribute('points',pointsStr);
    }

    get x(){
        return Math.min(...this.points.map(point => point.x)) || 0;
    }

    set x(value){
        const minX = this.x;
        const dx = value - minX;
        this.points = this.points.map(point => {
            return {
                ...point,
                x: point.x + dx
            }
        });
        this.render();
    }

    get y(){
        return Math.min(...this.points.map(point => point.y)) || 0;
    }

    set y(value){
        const minY = this.y;
        const dy = value - minY;
        this.points = this.points.map(point => {
           return {
               ...point,
               y: point.y + dy
           }
        });
    }

    get width(){
        const maxX = Math.max(...this.points.map(point => point.x));
        return maxX - this.x;
    }

    get height(){
        const maxY = Math.max(...this.points.map(point => point.y));
        return maxY - this.y;
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

    get strokeColor(){
        return this.line?.elem?.getAttribute('stroke');
    }

    set strokeColor(value){
        this.line?.elem?.setAttribute('stroke', value);
        this.arrow?.elem?.setAttribute('fill', value);
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

    serialize(){
        const type = this.type;
        const property = {
            id: this.id,
            parentId: this.parentId,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            points: this.points,
            strokeColor: this.strokeColor
        };

        return JSON.stringify({
            type,
            ...property,
        });
    }

    setProperty({ points, strokeColor }){
        this.points = points;
        this.strokeColor = strokeColor;
    }

    clickHandler(e) {
        if(ComponentRepository.getComponentById(this.itemMenubar.selectMenu).name !== 'mouse'){
            return;
        }

        if(e?.shiftKey && this.board.border) {
            super.clickHandler(e);
            return;
        }

        this.elem.parentNode?.appendChild?.(this.elem);

        this.board.destroyBorder();
        this.board.createLineBorder(this);

        this.styleMenubar.strokeInput.elem.value = this.strokeColor;
        this.styleMenubar.show();
    }
}

export default TransformManager.wrapLine(TransformManager.wrapShape(Line));