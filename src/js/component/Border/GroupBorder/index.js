import Border from '../index';
import TransformManager from '../../../service/TransformManager';
import EventController from '../../../service/EventController';
import {BEHAVIOR, BOARD_ID, COLOR, FONT} from '../../../service/constant';
import HistoryManager from '../../../service/HistoryManager';
import ComponentRepository from '../../../service/ComponentRepository';
import {GText, Shape} from '../../index';

export default class GroupBorder extends Border {
    static startPoint = {};
    board = null;
    _shapes = [];

    constructor({ parentId, id, x, y, width, height, shapes, board = ComponentRepository.getComponentById(BOARD_ID) }) {
        super({ parentId, id });

        this.board = board;
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
        if(this.shapes.length > 1) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:'Group' });
    }

    get fontColor(){
        return COLOR.BLACK;
    }

    set fontColor(value){
        this.shapes.forEach(shape => shape.fontColor = value);
        if(this.shapes.length > 1) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:'Group' });
    }

    get fill(){
        return COLOR.BLACK;
    }

    set fill(value){
        this.shapes.forEach(shape => shape.fill = value);
        if(this.shapes.length > 1) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:'Group' });
    }

    get strokeColor(){
        return COLOR.BLACK;
    }

    set strokeColor(value){
        this.shapes.forEach(shape => shape.strokeColor = value);
        if(this.shapes.length > 1) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:'Group' });
    }

    mouseDownHandler(e){
        e.stopPropagation();
        if(e.shiftKey) this.clickShapeInRange(e);
        GroupBorder.startPoint.x = TransformManager.changeDocXToSvgX(e.pageX);
        GroupBorder.startPoint.y = TransformManager.changeDocYToSvgY(e.pageY);
        this.startPointInit();

        EventController.mouseMoveHandler = (e) => {
            e.stopPropagation();
            const dx = TransformManager.changeDocXToSvgX(e.pageX) - GroupBorder.startPoint.x;
            const dy = TransformManager.changeDocYToSvgY(e.pageY) - GroupBorder.startPoint.y;
            this.moveHandler({ dx, dy });
        }

        EventController.mouseUpHandler = (e) => {
            e.stopPropagation();
            this.moveCompleteHandler();
            this.refocusThisBorder();
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

    deleteHandler() {
        this.shapes.forEach(shape => ComponentRepository.removeComponentById(shape.id));
        HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.DELETE, type: 'Group' });
        ComponentRepository.getComponentById(BOARD_ID).destroyBorder();
    }

    startPointInit(){
        GroupBorder.startPoint.borderX = TransformManager.changeDocXToSvgX(this.x);
        GroupBorder.startPoint.borderY = TransformManager.changeDocYToSvgY(this.y);
        GroupBorder.startPoint.shapes = this.shapes.map(({ x, y }) => {
            return { x, y }
        });
    }

    moveHandler({ dx, dy }){
        let x = GroupBorder.startPoint.borderX + dx;
        let y = GroupBorder.startPoint.borderY + dy;

        this.x = x;
        this.y = y;

        this.renderShapes({ dx, dy });
    }

    moveCompleteHandler(){
        GroupBorder.startPoint = {};
        HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MOVE, type:`Group` });
    }

    clickShapeInRange(e){
        const x = TransformManager.changeDocXToSvgX(e.pageX);
        const y = TransformManager.changeDocYToSvgY(e.pageY);
        for(const key in ComponentRepository) {
            const shape = ComponentRepository.getComponentById(key);
            if (!(shape instanceof Shape) && !(shape instanceof GText)) continue;

            const startX = shape.x;
            const startY = shape.y;
            const endX = shape.x + shape.width;
            const endY = shape.y + shape.height;

            if(x >= startX && y >= startY && x <= endX && y <= endY) {
                shape.clickHandler(e);
            }
        }
    }
}