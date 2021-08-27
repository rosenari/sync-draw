import GraphicElement from '../CommonElement/GraphicElement';
import {Board, Component} from '../../component';
import { ComponentRepository } from '../../service';
import {BOARD_ID, BORDER, COLOR} from '../../service/constant';
import {setDisablePointerEvent} from '../../service/util';

export default class Border extends GraphicElement{
    public board: Board;
    private _shape = null;
    private _x = 0;
    private _y = 0;
    private _width = 0;
    private _height = 0;

    constructor({ parentId, id, shape = null, board = <Board>ComponentRepository.getComponentById(BOARD_ID) }) {
        super({
            parentId,
            id,
            tagName: 'polyline'
        });
        this.board = board;
        this.shape = shape;
        this.elem.setAttribute('style','pointer-events: none;');
        this.elem.setAttribute('stroke', COLOR.BLACK);
        this.elem.setAttribute('fill', 'transparent');
        this.elem.setAttribute('stroke-width', '3');

        if(this.shape) {
            this.shape.elem.setAttribute('stroke',COLOR.ORANGE);
            this.shape.elem.setAttribute('stroke-width','3');
            this.shape.elem.setAttribute('stroke-dasharray','6');
        }
    }

    public render() {
        const startX = this.x;
        const startY = this.y;
        const endX = startX + this.width;
        const endY = startY + this.height;
        this.elem.setAttribute('points',`${startX},${startY} ${endX},${startY} ${endX},${endY} ${startX},${endY} ${startX},${startY}`);
    }

    public get x() {
        return this.getX();
    }

    public getX(){
        return this._x;
    }

    public set x(value) {
       this.setX(value);
    }

    public setX(value){
        if(this.shape) {
            this.shape.x = value;
        }
        this._x = value;
        this.render();
    }

    public get y() {
        return this.getY();
    }

    public getY(){
        return this._y;
    }

    public set y(value) {
        this.setY(value);
    }

    public setY(value){
        if(this.shape) {
            this.shape.y = value;
        }
        this._y = value;
        this.render();
    }

    public get width() {
        return this.getWidth();
    }

    public getWidth(){
        return this._width;
    }

    public set width(value) {
        this.setWidth(value);
    }

    public setWidth(value){
        if(this.shape) {
            this.shape.width = value;
        }
        this._width = value;
        this.render();
    }

    public get height() {
        return this.getHeight();
    }

    public getHeight(){
        return this._height;
    }

    public set height(value) {
        this.setHeight(value);
    }

    public setHeight(value){
        if(this.shape) {
            this.shape.height = value;
        }
        this._height = value;
        this.render();
    }

    public get shape() {
        return this._shape;
    }

    public set shape(value) {
        this._shape = value;
    }

    public refocusThisBorder(){
        setDisablePointerEvent(false);
        this.board.destroySpecificBorder([BORDER.DRAG_BORDER_ID]);
        this.board.border = this;
    }

    public startPointInit({ x, y }: { x?: number; y?: number; } = {}): void {}

    public deleteHandler(e?: MouseEvent, component?: Component): void {}

    public moveHandler({ dx, dy }: { dx?: number; dy?: number; }) {}

    public moveCompleteHandler() {}
}