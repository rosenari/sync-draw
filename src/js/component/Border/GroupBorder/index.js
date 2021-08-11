import Border from '../index';
import TransformManager from '../../../service/TransformManager';
import EventController from '../../../service/EventController';
import {BEHAVIOR, COLOR, FONT} from "../../../service/constant";
import HistoryManager from '../../../service/HistoryManager';

export default class GroupBorder extends Border {
    static startPoint = {};
    _shapes = [];

    constructor({ parentId, id, x, y, width, height, shapes }) {
        super({ parentId, id });

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.shapes = shapes;
        this.elem.setAttribute('style','cursor:move;');
        this.elem.setAttribute('stroke', COLOR.ORANGE);
    }

    get x(){
        return super.x;
    }

    set x(value){
        super.x = TransformManager.changeSvgXToDocX(+value);
    }

    get y(){
        return super.y;
    }

    set y(value){
        super.y = TransformManager.changeSvgYToDocY(+value);
    }

    get width(){
        return super.width;
    }

    set width(value){
        super.width = TransformManager.changeSvgWidthToDocWidth(+value);
    }

    get height(){
        return super.height;
    }

    set height(value){
        super.height = TransformManager.changeSvgHeightToDocHeight(+value);
    }

    get shapes() {
        return this._shapes;
    }

    set shapes(value) {
        this._shapes = value;
    }

    get fontSize(){
        return FONT.SIZE_3;
    }

    set fontSize(value){
        this.shapes.forEach(shape => shape.fontSize = value);
    }

    get fontColor(){
        return COLOR.BLACK;
    }

    set fontColor(value){
        this.shapes.forEach(shape => shape.fontColor = value);
    }

    get fill(){
        return COLOR.BLACK;
    }

    set fill(value){
        this.shapes.forEach(shape => shape.fill = value);
    }

    get strokeColor(){
        return COLOR.BLACK;
    }

    set strokeColor(value){
        this.shapes.forEach(shape => shape.strokeColor = value);
    }

    mouseDownHandler(e){
        e.stopPropagation();
        GroupBorder.startPoint.x = TransformManager.changeDocXToSvgX(e.pageX);
        GroupBorder.startPoint.y = TransformManager.changeDocYToSvgY(e.pageY);
        GroupBorder.startPoint.borderX = TransformManager.changeDocXToSvgX(this.x);
        GroupBorder.startPoint.borderY = TransformManager.changeDocYToSvgY(this.y);
        GroupBorder.startPoint.shapes = this.shapes.map(({ x, y }) => {
            return { x, y }
        });

        EventController.mouseMoveHandler = (e) => {
            e.stopPropagation();
            const dx = TransformManager.changeDocXToSvgX(e.pageX) - GroupBorder.startPoint.x;
            const dy = TransformManager.changeDocYToSvgY(e.pageY) - GroupBorder.startPoint.y;
            let x = GroupBorder.startPoint.borderX + dx;
            let y = GroupBorder.startPoint.borderY + dy;

            this.x = x;
            this.y = y;

            this.renderShapes({ dx, dy });
        }

        EventController.mouseUpHandler = (e) => {
            e.stopPropagation();
            GroupBorder.startPoint = {};
            HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MOVE, type:`Group` });
            EventController.mouseMoveHandler = null;
            EventController.mouseUpHandler = null;
        }
    }

    renderShapes({ dx, dy }){
        for(const index in this.shapes){
            const shape = this.shapes[index];
            shape.x = TransformManager.changeSvgXToDocX(GroupBorder.startPoint.shapes[index].x + dx);
            shape.y = TransformManager.changeSvgYToDocY(GroupBorder.startPoint.shapes[index].y + dy);
        }
    }
}