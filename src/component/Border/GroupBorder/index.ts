import Border from '../index';
import { Board, Shape } from '../../index';
import { ComponentRepository, TransformManager, HistoryManager, EventController } from '../../../service';
import {BEHAVIOR, BOARD_ID, COLOR, FONT} from '../../../service/constant';
import {ColorCode, FontSize} from '../../../service/util';

type GroupBorderStartPoint = {
    x: number;
    y: number;
    borderX: number;
    borderY: number;
    shapes: Array<{
        x: number;
        y: number;
    }>;
};

export default class GroupBorder extends Border {
    public static startPoint: GroupBorderStartPoint;
    public board: Board = null;
    private _shapes: Array<Shape> = [];

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, shapes = [], board = <Board>ComponentRepository.getComponentById(BOARD_ID) }: {
        parentId: string;
        id: string;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        shapes?: Array<Shape>;
        board?: Board
    }) {
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

    public get x(): number{
        return this.getX();
    }

    public set x(value: number){
        this.setX(TransformManager.changeSvgXToDocX(+value));
    }

    public get y(): number{
        return this.getY();
    }

    public set y(value: number){
        this.setY(TransformManager.changeSvgYToDocY(+value));
    }

    public get width(): number{
        return this.getWidth();
    }

    public set width(value: number){
        this.setWidth(TransformManager.changeSvgWidthToDocWidth(+value));
    }

    public get height(): number{
        return this.getHeight();
    }

    public set height(value: number){
        this.setHeight(TransformManager.changeSvgHeightToDocHeight(+value));
    }

    public get shapes(): Array<Shape> {
        return this._shapes;
    }

    public set shapes(value: Array<Shape>) {
        this._shapes = value;
    }

    public get fontSize(): FontSize{
        return FONT.SIZE_3;
    }

    public set fontSize(value){
        this.shapes.forEach(shape => shape.fontSize = value);
        if(this.shapes.length > 1) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:'Group' });
    }

    get fontColor(): ColorCode{
        return COLOR.BLACK;
    }

    public set fontColor(value: ColorCode){
        this.shapes.forEach(shape => shape.fontColor = value);
        if(this.shapes.length > 1) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:'Group' });
    }

    public get fill(): ColorCode{
        return COLOR.BLACK;
    }

    public set fill(value: ColorCode){
        this.shapes.forEach(shape => shape.fill = value);
        if(this.shapes.length > 1) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:'Group' });
    }

    public get strokeColor(): ColorCode{
        return COLOR.BLACK;
    }

    public set strokeColor(value: ColorCode){
        this.shapes.forEach(shape => shape.strokeColor = value);
        if(this.shapes.length > 1) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:'Group' });
    }

    public mouseDownHandler(e: MouseEvent){
        e.stopPropagation();
        if(e.shiftKey) this.clickShapeInRange(e);
        this.startPointInit(e);

        EventController.mouseMoveHandler = (e?: MouseEvent) => {
            e.stopPropagation();
            const dx = TransformManager.changeDocXToSvgX(e.pageX) - GroupBorder.startPoint.x;
            const dy = TransformManager.changeDocYToSvgY(e.pageY) - GroupBorder.startPoint.y;
            this.moveHandler({ dx, dy });
        }

        EventController.mouseUpHandler = (e?: MouseEvent) => {
            e.stopPropagation();
            this.moveCompleteHandler();
            this.refocusThisBorder();
            EventController.mouseMoveHandler = null;
            EventController.mouseUpHandler = null;
        }
    }

    public renderShapes({ dx, dy }: {
        dx: number;
        dy: number;
    }){
        this.shapes.forEach((shape, index) => {
            shape.x = TransformManager.changeSvgXToDocX(GroupBorder.startPoint.shapes[index].x + dx);
            shape.y = TransformManager.changeSvgYToDocY(GroupBorder.startPoint.shapes[index].y + dy);
        });
    }

    public deleteHandler(e: MouseEvent, board = <Board>ComponentRepository.getComponentById(BOARD_ID)) {
        this.shapes.forEach(shape => ComponentRepository.removeComponentById(shape.id));
        HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.DELETE, type: 'Group' });
        board.destroyBorder();
    }

    public startPointInit(e?: MouseEvent){
        GroupBorder.startPoint = {
            x: TransformManager.changeDocXToSvgX(e.pageX),
            y: TransformManager.changeDocYToSvgY(e.pageY),
            borderX: TransformManager.changeDocXToSvgX(this.x),
            borderY: TransformManager.changeDocYToSvgY(this.y),
            shapes: this.shapes.map(({ x, y }) => {
                return { x, y }
            })
        }
    }

    public moveHandler({ dx, dy }: {
        dx: number;
        dy: number;
    }){
        let x = GroupBorder.startPoint.borderX + dx;
        let y = GroupBorder.startPoint.borderY + dy;

        this.x = x;
        this.y = y;

        this.renderShapes({ dx, dy });
    }

    public moveCompleteHandler(){
        GroupBorder.startPoint = null;
        HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MOVE, type:`Group` });
    }

    public clickShapeInRange(e: MouseEvent){
        const x = TransformManager.changeDocXToSvgX(e.pageX);
        const y = TransformManager.changeDocYToSvgY(e.pageY);
        for(const key in ComponentRepository) {
            const shape = <Shape>ComponentRepository.getComponentById(key);
            if (!(shape instanceof Shape)) continue;

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