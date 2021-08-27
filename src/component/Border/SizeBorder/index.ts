import Border from '../index';
import { GraphicElement, Board, Shape } from '../../index';
import { TransformManager, ComponentRepository, HistoryManager, EventController } from '../../../service';
import {COLOR, BORDER, GROUP, BEHAVIOR, BOARD_ID, CURSOR_TYPE} from '../../../service/constant';
import {
    ColorCode,
    FontSize,
    getOverflowHeight,
    getOverflowWidth,
    isOverflowHeight,
    isOverflowWidth,
    tinyGUID
} from '../../../service/util';

type ShapeInfo = {
    x: number;
    y: number;
    width: number;
    height :number;
}

export type SizeBorderStartPoint = {
    x: number;
    y: number;
    target: ShapeInfo;
    oppX?: number;
    oppY?: number;
    id?: string;
    notOverflowInfo?: ShapeInfo
};

export default class SizeBorder extends Border {
    public static startPoint: SizeBorderStartPoint;
    private _ratios: Array<number> = [0, 0.5 ,1];
    private _points: Array<SVGCircleElement> = [];
    private _target: Shape;

    constructor({ parentId, target }) {
        super({
            parentId,
            id: BORDER.SIZE_BORDER_ID
        });

        this.target = <Shape>target;
        this.x = this.target.x;
        this.y = this.target.y;
        this.width = this.target.width;
        this.height = this.target.height;
        this.elem.setAttribute('stroke-width', '6');
        this.elem.setAttribute('stroke',COLOR.GRAY);
        this.elem.setAttribute('style','cursor:move;');

        this.createEdge();
    }

    public get x() :number{
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

    public get ratios(): Array<number> {
        return this._ratios;
    }

    public set ratios(value: Array<number>) {
        this._ratios = value;
    }

    public get points(): Array<SVGCircleElement> {
        return this._points;
    }

    public set points(value: Array<SVGCircleElement>) {
        this._points = value;
    }

    public get target(): Shape {
        return this._target;
    }

    public set target(value: Shape) {
        this._target = value;
    }

    public get fontSize(): FontSize{
        return this.target.fontSize;
    }

    public set fontSize(value: FontSize){
        this.target.fontSize = value;
        const target = this.target.innerText?.textBox;

        if(!target) return;

        while(isOverflowWidth(target.elem)){
            this.width += getOverflowWidth(target.elem);
            this.renderEdge({ x: this.x, y: this.y, width: this.width, height: this.height });
            this.renderTarget();
        }
        while(isOverflowHeight(target.elem)){
            this.height += getOverflowHeight(target.elem);
            this.renderEdge({ x: this.x, y: this.y, width: this.width, height: this.height });
            this.renderTarget();
        }

        if(this.target.fontSize){
            HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
                type:`${this.target.type}` });
        }
    }

    public get fontColor(): ColorCode{
        return this.target.fontColor;
    }

    public set fontColor(value: ColorCode){
        this.target.fontColor = value;
        if(this.target.fontColor){
            HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
                type:`${this.target.type}` });
        }
    }

    public get fill(): ColorCode{
        return this.target.fill;
    }

    public set fill(value: ColorCode){
        this.target.fill = value;
        if(this.target.fill) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:`${this.target.type}` });
    }

    public get strokeColor(): ColorCode{
        return this.target.strokeColor;
    }

    public set strokeColor(value: ColorCode){
        this.target.strokeColor = value;
        if(this.target.strokeColor) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:`${this.target.type}` });
    }

    public getOppositionIndex({ maxIndex, index }: {
        maxIndex: number;
        index: number;
    }){
        if(index < 0 || index > maxIndex){
            throw new Error(`${index} is wrong input (0 < input <= ${maxIndex})`);
        }

        return maxIndex - index;
    }

    public createEdge(){
        for(const i in this.ratios){
            for(const j in this.ratios){
                if(parseInt(i) === 1 && parseInt(j) == 1) continue;
                const point = new GraphicElement({
                    parentId: GROUP.TEMP_GROUP_ID,
                    id: tinyGUID(),
                    tagName: 'circle',
                    handlers: {
                        mouseDownHandler: (e?: MouseEvent) => {
                            e.stopPropagation();
                            const currentPointIndexInfo = {
                                maxIndex: this.points.length-1,
                                index: +(<SVGCircleElement>e.target).dataset.index
                            };
                            this.startPointInit({
                                x: TransformManager.changeDocXToSvgX(+(<SVGCircleElement>e.target).getAttribute('cx')),
                                y: TransformManager.changeDocYToSvgY(+(<SVGCircleElement>e.target).getAttribute('cy'))
                            })
                            SizeBorder.startPoint.oppX = TransformManager.changeDocXToSvgX(+this.points[+this.getOppositionIndex(currentPointIndexInfo)].getAttribute('cx'));
                            SizeBorder.startPoint.oppY = TransformManager.changeDocYToSvgY(+this.points[+this.getOppositionIndex(currentPointIndexInfo)].getAttribute('cy'));
                            SizeBorder.startPoint.id = (<SVGCircleElement>e.target).id;

                            EventController.mouseMoveHandler = (e?: MouseEvent) => {
                                e.stopPropagation();
                                const id = SizeBorder.startPoint.id;
                                let dx = TransformManager.changeDocXToSvgX(e.pageX) - SizeBorder.startPoint.x;
                                let dy = TransformManager.changeDocYToSvgY(e.pageY) - SizeBorder.startPoint.y;
                                let width = SizeBorder.startPoint.target.width + dx;
                                let height = SizeBorder.startPoint.target.height + dy;
                                let x = SizeBorder.startPoint.target.x;
                                let y = SizeBorder.startPoint.target.y;
                                if(width < 0){
                                    x = SizeBorder.startPoint.x + dx;
                                }
                                if(height < 0){
                                    y = SizeBorder.startPoint.y + dy;
                                }
                                if(x >= SizeBorder.startPoint.x) {
                                    width = SizeBorder.startPoint.target.width - dx;
                                    x = width < 0 ? SizeBorder.startPoint.oppX : SizeBorder.startPoint.target.x + dx;
                                }
                                if(y >= SizeBorder.startPoint.y){
                                    height = SizeBorder.startPoint.target.height - dy;
                                    y = height < 0 ? SizeBorder.startPoint.oppY: SizeBorder.startPoint.target.y + dy;
                                }

                                if(id === this.points[1].id || id === this.points[6].id){
                                    width = SizeBorder.startPoint.target.width;
                                }
                                if(id === this.points[3].id || id === this.points[4].id){
                                    height = SizeBorder.startPoint.target.height;
                                }

                                this.x = x;
                                this.y = y;
                                this.width = Math.abs(width);
                                this.height = Math.abs(height);

                                this.renderEdge({x: this.x, y:this.y, width:this.width, height: this.height});
                                this.renderTarget();
                                this.detectOverflow();
                            }

                            EventController.mouseUpHandler = (e?: MouseEvent) => {
                                e.stopPropagation();
                                this.adjustOverflowInfo();

                                this.renderEdge({x: this.x, y:this.y, width:this.width, height: this.height});
                                this.renderTarget();
                                if(!this.isEqualShape(SizeBorder.startPoint.target)) {
                                    HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY, type:`${this.target.type}` });
                                }
                                this.refocusThisBorder();
                                SizeBorder.startPoint = null;
                                EventController.mouseMoveHandler = null;
                                EventController.mouseUpHandler = null;
                            }
                        }
                    }
                });

                point.elem.setAttribute('r', '5');
                point.elem.setAttribute('cx', (this.x + this.ratios[j] * this.width).toString());
                point.elem.setAttribute('cy', (this.y + this.ratios[i] * this.height).toString());
                point.elem.setAttribute('fill', COLOR.ORANGE);
                point.elem.setAttribute('cursor', CURSOR_TYPE.GRAB);
                point.elem.setAttribute('data-index', this.points.length.toString());
                this.points.push(<SVGCircleElement>point.elem);
            }
        }
    }

    public renderEdge({ x, y, width = 0, height = 0 }: {
        x: number;
        y: number;
        width?: number;
        height?: number;
    }){
        let k = 0;
        for(const i in this.ratios){
            for(const j in this.ratios){
                if(parseInt(i) === 1 && parseInt(j) === 1) continue;
                const cx = x + this.ratios[j] * width;
                const cy = y + this.ratios[i] * height;
                this.points[k].setAttribute('cx', cx.toString());
                this.points[k].setAttribute('cy', cy.toString());
                k++;
            }
        }
    }

    public mouseDownHandler(e?: MouseEvent){
        e.stopPropagation();
        this.startPointInit({
            x: TransformManager.changeDocXToSvgX(e.pageX),
            y: TransformManager.changeDocYToSvgY(e.pageY)
        });

        EventController.mouseMoveHandler = (e?: MouseEvent) => {
            e.stopPropagation();
            const dx = TransformManager.changeDocXToSvgX(e.pageX) - SizeBorder.startPoint.x;
            const dy = TransformManager.changeDocYToSvgY(e.pageY) - SizeBorder.startPoint.y;
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
        this.target.x = this.x;
        this.target.y = this.y;
        this.target.width = this.width;
        this.target.height = this.height;
    }

    public detectOverflow(){
        const innerText = this.target.innerText;
        if(innerText && !isOverflowWidth(innerText.textBox.elem) && !isOverflowHeight(innerText.textBox.elem)){
            SizeBorder.startPoint.notOverflowInfo = {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            };
        }
    }

    public adjustOverflowInfo(){
        const innerText = this.target.innerText;
        if(innerText && (isOverflowWidth(innerText.textBox.elem) || isOverflowHeight(innerText.textBox.elem))){
            const adjustInfo = SizeBorder.startPoint.notOverflowInfo || SizeBorder.startPoint.target;
            this.x = adjustInfo.x;
            this.y = adjustInfo.y;
            this.width = adjustInfo.width;
            this.height = adjustInfo.height;
        }
    }

    public dbClickHandler(e: MouseEvent){
        this.target?.dbClickHandler?.(e);
    }

    public deleteHandler(e?: MouseEvent, board: Board = <Board>ComponentRepository.getComponentById(BOARD_ID)) {
        ComponentRepository.removeComponentById(this.target.id);
        HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.DELETE, type: this.target.type });
        board.destroyBorder();
    }

    public startPointInit({ x, y }: {
        x: number;
        y: number;
    }){
        SizeBorder.startPoint = {
            x, y,
            target : {
                x: this.target.x,
                y: this.target.y,
                width: this.target.width,
                height: this.target.height
            }
        }
    }

    public isEqualShape({ x = 0, y = 0, width = 0, height = 0 }: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    } = {}): boolean{
        return (x === undefined ? true : x === this.target.x)
            && (y === undefined ? true :  y === this.target.y)
            && (width === undefined ? true : width === this.target.width)
            && (height === undefined ? true : height === this.target.height) ;
    }

    public moveHandler({ dx, dy }: {
        dx: number;
        dy: number;
    }){
        let x = SizeBorder.startPoint.target.x + dx;
        let y = SizeBorder.startPoint.target.y + dy;
        let width = SizeBorder.startPoint.target.width;
        let height = SizeBorder.startPoint.target.height;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.renderEdge({ x:this.x, y:this.y, width:this.width, height:this.height });
        this.renderTarget();
    }

    public moveCompleteHandler(){
        if(!this.isEqualShape(SizeBorder.startPoint.target)) {
            HistoryManager.updateHistoryToLatest({behavior: BEHAVIOR.MOVE, type: `${this.target.type}`});
        }

        SizeBorder.startPoint = null;
        this.renderTarget();
    }
}