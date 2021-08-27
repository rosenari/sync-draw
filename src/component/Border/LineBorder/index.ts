import SizeBorder from '../SizeBorder';
import { GraphicElement, Shape, Line, Board } from '../../index';
import { TransformManager, EventController, HistoryManager, ComponentRepository } from '../../../service';
import { Point, PointInfo } from '../../Shape/Line';
import { BEHAVIOR, BOARD_ID, COLOR, GROUP } from '../../../service/constant';
import { tinyGUID } from '../../../service/util';
import './index.css';

export type LineBorderStartPoint = {
    points: Array<Point & { index: number; }>;
    x?: number;
    y?: number;
    target?: {
        points: Array<Point>;
        index: number;
    };
    collisionInfo?: Array<{
        command: string;
        shape: Shape;
        pointInfo: PointInfo
    }>
};

export default class LineBorder extends SizeBorder {
    public static lineStartPoint: LineBorderStartPoint;
    public static padding = 30;

    constructor({ parentId, target }: {
        parentId: string;
        target: Line
    }) {
        super({
            parentId,
            target
        });
        this.elem.setAttribute('stroke-dasharray','0');
    }

    public render() {
        const pointsStr = [...this.points].map(point => `${point.getAttribute('cx')} ${point.getAttribute('cy')}`).join(', ');
        this.elem.setAttribute('points',pointsStr);
    }

    public createEdge(){
        const points = (<Line>this.target).points;
        for(const i in points){
            const point = new GraphicElement({
                parentId: GROUP.TEMP_GROUP_ID,
                id: tinyGUID(),
                tagName: 'circle',
                handlers: {
                    mouseDownHandler: (e?: MouseEvent) => {
                        e.stopPropagation();
                        this.startPointInit();
                        LineBorder.lineStartPoint.x = TransformManager.changeDocXToSvgX(+(<HTMLElement>e.target).getAttribute('cx'));
                        LineBorder.lineStartPoint.y = TransformManager.changeDocYToSvgY(+(<HTMLElement>e.target).getAttribute('cy'));
                        LineBorder.lineStartPoint.collisionInfo = [];
                        LineBorder.lineStartPoint.target = {
                            points: [...(<Line>this.target).points].map(point => {
                                return {
                                    ...point
                                }
                            }),
                            index: +(<HTMLElement>e.target).dataset.index
                        }

                        EventController.mouseMoveHandler = (e?: MouseEvent) => {
                            const dx = TransformManager.changeDocXToSvgX(e.pageX) - LineBorder.lineStartPoint.x;
                            const dy = TransformManager.changeDocYToSvgY(e.pageY) - LineBorder.lineStartPoint.y;
                            const x = LineBorder.lineStartPoint.x + dx;
                            const y = LineBorder.lineStartPoint.y + dy;
                            const index = LineBorder.lineStartPoint.target.index;

                            this.detectCollisionShape({ x, y, index });
                            this.renderEdge({ x, y, index });
                            this.renderTarget();
                            this.render();
                        }

                        EventController.mouseUpHandler = (e?: MouseEvent) => {
                            this.adjustCollisionInfo();
                            this.renderTarget();
                            if(!this.isEqualLine(LineBorder.lineStartPoint.points)){
                                HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY, type:`${this.target.type}` });
                            }
                            this.refocusThisBorder();
                            LineBorder.lineStartPoint = null;
                            EventController.mouseMoveHandler = null;
                            EventController.mouseUpHandler = null;
                        }
                    }
                }
            });

            point.elem.setAttribute('r','5');
            point.elem.setAttribute('cx', TransformManager.changeSvgXToDocX(points[+i].x).toString());
            point.elem.setAttribute('cy', TransformManager.changeSvgYToDocY(points[+i].y).toString());
            point.elem.setAttribute('fill',COLOR.ORANGE);
            point.elem.setAttribute('cursor','grab');
            point.elem.setAttribute('data-index',this.points.length.toString());
            this.points.push(<SVGCircleElement>point.elem);
        }
        this.render();
    }

    public renderEdge({ x, y, index } : {
        x: number;
        y: number;
        index: number;
    }) {
        this.points[index].setAttribute('cx', TransformManager.changeSvgXToDocX(x).toString());
        this.points[index].setAttribute('cy', TransformManager.changeSvgYToDocY(y).toString());
    }

    public mouseDownHandler(e: MouseEvent) {
        e.stopPropagation();
        this.startPointInit();
        LineBorder.lineStartPoint.x = TransformManager.changeDocXToSvgX(e.pageX);
        LineBorder.lineStartPoint.y = TransformManager.changeDocYToSvgY(e.pageY);

        EventController.mouseMoveHandler = (e?: MouseEvent) => {
            e.stopPropagation();
            const dx = TransformManager.changeDocXToSvgX(e.pageX) - LineBorder.lineStartPoint.x;
            const dy = TransformManager.changeDocYToSvgY(e.pageY) - LineBorder.lineStartPoint.y;

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

    public renderTarget(){
        (<Line>this.target).points = [...this.points].map(point => {
            return {
                x: TransformManager.changeDocXToSvgX(+point.getAttribute('cx')),
                y: TransformManager.changeDocYToSvgY(+point.getAttribute('cy'))
            }
        });
    }

    //모양과 충돌하는지 순회를 통해탐지, 탐지할 경우 충돌정보 갱신
    public detectCollisionShape({ x, y, index}: { x: number; y: number; index: number; }){
        if(!(<Line>this.target).arrow) return;

        LineBorder.lineStartPoint.collisionInfo = [];
        for(const key in ComponentRepository) {
            const component = ComponentRepository.getComponentById(key);
            if (!(component instanceof Shape)) continue;
            if (component instanceof Line) continue;
            const shape = <Shape>component;

            const padding = 30;
            const startX = shape.x;
            const startY = shape.y;
            const endX = shape.x + shape.width;
            const endY = shape.y + shape.height;

            const ratioX = parseFloat(((x - startX) / shape.width).toFixed(2));
            const ratioY = parseFloat(((y - startY) / shape.height).toFixed(2));

            let command = 'addLinkedLine';
            let pointInfo = {
                ratios: [ratioX, ratioY],
                index
            }

            if(startX - padding > x || endX + padding < x || startY - padding > y || endY + padding < y){
                command = 'removeLinkedLine';
                shape.elem.classList.remove('shape-collision');
            }else{
                shape.elem.classList.add('shape-collision');
            }

            LineBorder.lineStartPoint.collisionInfo.push({
                command,
                shape,
                pointInfo
            });
        }
    }

    public detectCollisionShapeForMove({ dx, dy } : {
        dx: number;
        dy: number;
    }){
        if(!(<Line>this.target).arrow) return;

        const pointA = LineBorder.lineStartPoint.points[0];
        const pointB = LineBorder.lineStartPoint.points[1];
        const pointAoffsetX = pointA.x + dx;
        const pointAoffsetY = pointA.y + dy;
        const pointBoffsetX = pointB.x + dx;
        const pointBoffsetY = pointB.y + dy;

        LineBorder.lineStartPoint.collisionInfo = [];
        for(const key in ComponentRepository) {
            const shape = <Shape>this.getShape(key);
            if(!shape) continue;

            const { startX, startY, endX, endY } = this.getStartEndXY(shape);

            const pointARatioX = parseFloat(((pointAoffsetX - startX) / shape.width).toFixed(2));
            const pointARatioY = parseFloat(((pointAoffsetY - startY) / shape.height).toFixed(2));
            const pointBRatioX = parseFloat(((pointBoffsetX - startX) / shape.width).toFixed(2));
            const pointBRatioY = parseFloat(((pointBoffsetY - startY) / shape.height).toFixed(2));

            const addCommand = 'addLinkedLine';
            const removeCommand = 'removeLinkedLine';
            const pointAInfo = {
                ratios: [pointARatioX, pointARatioY],
                index: pointA.index
            }
            const pointBInfo = {
                ratios: [pointBRatioX, pointBRatioY],
                index: pointB.index
            }

            const isPointANotInclude = startX - LineBorder.padding > pointAoffsetX || endX + LineBorder.padding < pointAoffsetX
                || startY - LineBorder.padding > pointAoffsetY || endY + LineBorder.padding < pointAoffsetY;
            const isPointBNotInclude = startX - LineBorder.padding > pointBoffsetX || endX + LineBorder.padding < pointBoffsetX
                || startY - LineBorder.padding > pointBoffsetY || endY + LineBorder.padding < pointBoffsetY;

            if(isPointANotInclude && isPointBNotInclude){
                shape.elem.classList.remove('shape-collision');
                this.pushCommandToCollisionInfo({ command: removeCommand, shape, pointInfo: pointAInfo});
                this.pushCommandToCollisionInfo({ command: removeCommand, shape, pointInfo: pointBInfo});
                continue;
            }

            if(!isPointANotInclude){
                shape.elem.classList.add('shape-collision');
                this.pushCommandToCollisionInfo({ command: addCommand, shape, pointInfo: pointAInfo});
                isPointBNotInclude && this.pushCommandToCollisionInfo({ command: removeCommand, shape, pointInfo: pointBInfo});
            }
            if(!isPointBNotInclude){
                shape.elem.classList.add('shape-collision');
                this.pushCommandToCollisionInfo({ command: addCommand, shape, pointInfo: pointBInfo});
                isPointANotInclude && this.pushCommandToCollisionInfo({ command: removeCommand, shape, pointInfo: pointAInfo});
            }
        }
    }

    public getShape(id: string): Shape{
        const shape = ComponentRepository.getComponentById(id);
        if (!(shape instanceof Shape)) return null;
        if (shape instanceof Line) return null;
        return <Shape>shape;
    }

    public getStartEndXY(shape: Shape){
        return {
            startX : shape.x,
            startY : shape.y,
            endX : shape.x + shape.width,
            endY : shape.y + shape.height
        }
    }

    public pushCommandToCollisionInfo({ command, shape, pointInfo} : {
        command: string;
        shape: Shape;
        pointInfo: PointInfo
    }){
        LineBorder.lineStartPoint.collisionInfo.push({
            command,
            shape,
            pointInfo
        });
    }

    //모양요소 흐름선 정보 갱신
    public adjustCollisionInfo(){
        if(!(<Line>this.target).arrow) return;

        const collisionInfos = LineBorder.lineStartPoint.collisionInfo || [];
        const line = this.target;
        for(const info of collisionInfos){
            info.shape.elem.classList.remove('shape-collision');
            info.shape[info.command]({
                line,
                pointInfo: info.pointInfo
            });
        }
    }

    public isEqualLine( points: Array<Point & { index:number; }>): boolean {
        const target = [...this.points].map(point => {
            return {
                x: TransformManager.changeDocXToSvgX(+point.getAttribute('cx')),
                y: TransformManager.changeDocYToSvgY(+point.getAttribute('cy')),
                index: point.dataset.index
            }
        });
        return JSON.stringify(target) === JSON.stringify(points);
    }

    public deleteHandler(e?: MouseEvent, board: Board = <Board>ComponentRepository.getComponentById(BOARD_ID)) {
        ComponentRepository.removeComponentById(this.target.id);
        HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.DELETE, type: this.target.type });
        board.destroyBorder();
    }

    public startPointInit(){
        LineBorder.lineStartPoint = {
            points : [...this.points].map(point => {
                return {
                    x: TransformManager.changeDocXToSvgX(+point.getAttribute('cx')),
                    y: TransformManager.changeDocYToSvgY(+point.getAttribute('cy')),
                    index: +point.dataset.index
                }
            })
        }
    }

    public moveHandler({ dx, dy } : {
        dx: number;
        dy: number;
    }){
        LineBorder.lineStartPoint.collisionInfo = [];
        LineBorder.lineStartPoint.points.forEach((point, index) => {
            this.renderEdge({ x:+point.x + dx, y:+point.y + dy, index });
        });
        this.detectCollisionShapeForMove({ dx, dy });

        this.renderTarget();
        this.render();
    }

    public moveCompleteHandler(){
        this.adjustCollisionInfo();
        this.renderTarget();
        if(!this.isEqualLine(LineBorder.lineStartPoint.points)) {
            HistoryManager.updateHistoryToLatest({behavior: BEHAVIOR.MOVE, type: `${this.target.type}`});
        }
        LineBorder.lineStartPoint = null;
    }
}