import Border from '../index';
import GraphicElement from '../../GraphicElement';
import ComponentRepository from '../../../service/ComponentRepository';
import {
    getOverflowHeight,
    getOverflowWidth,
    isOverflowHeight,
    isOverflowWidth,
    setDisablePointerEvent,
    tinyGUID
} from '../../../service/util';
import EventController from '../../../service/EventController';
import TransformManager from '../../../service/TransformManager';
import {COLOR, BORDER, GROUP, BEHAVIOR, BOARD_ID} from '../../../service/constant';
import HistoryManager from '../../../service/HistoryManager';

export default class SizeBorder extends Border {
    static startPoint = {};
    _ratios = [0, 0.5 ,1];
    _points = [];
    _target = null;

    constructor({ parentId, target }) {
        super({
            parentId,
            id: BORDER.SIZE_BORDER_ID
        });

        this.target = target;
        this.x = this.target.x;
        this.y = this.target.y;
        this.width = this.target.width;
        this.height = this.target.height;
        this.elem.setAttribute('stroke-width', '6');
        this.elem.setAttribute('stroke',COLOR.GRAY);
        this.elem.setAttribute('style','cursor:move;');

        this.createEdge();
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

    get ratios() {
        return this._ratios;
    }

    set ratios(value) {
        this._ratios = value;
    }

    get points() {
        return this._points;
    }

    set points(value) {
        this._points = value;
    }

    get target() {
        return this._target;
    }

    set target(value) {
        this._target = value;
    }

    get fontSize(){
        return this.target.fontSize;
    }

    set fontSize(value){
        this.target.fontSize = value;
        const target = this.target.innerText.textBox;

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

    get fontColor(){
        return this.target.fontColor;
    }

    set fontColor(value){
        this.target.fontColor = value;
        if(this.target.fontColor){
            HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
                type:`${this.target.type}` });
        }
    }

    get fill(){
        return this.target.fill;
    }

    set fill(value){
        this.target.fill = value;
        if(this.target.fill) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:`${this.target.type}` });
    }

    get strokeColor(){
        return this.target.strokeColor;
    }

    set strokeColor(value){
        this.target.strokeColor = value;
        if(this.target.strokeColor) HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY,
            type:`${this.target.type}` });
    }

    getOppositionIndex({ maxIndex, index }){
        if(index < 0 || index > maxIndex){
            throw new Error(`${index} is wrong input (0 < input <= ${maxIndex})`);
        }

        return maxIndex - index;
    }

    createEdge(){
        const tempGroup = ComponentRepository.getComponentById(GROUP.TEMP_GROUP_ID);
        for(const i in this.ratios){
            for(const j in this.ratios){
                if(i == 1 && j == 1) continue;
                const point = new GraphicElement({
                    parentId: tempGroup.id,
                    id: tinyGUID(),
                    tagName: 'circle',
                    handlers: {
                        mouseDownHandler: (e) => {
                            e.stopPropagation();
                            const currentPointIndexInfo = {
                                maxIndex: this.points.length-1,
                                index: e.target.dataset.index
                            };
                            SizeBorder.startPoint.x = TransformManager.changeDocXToSvgX(+e.target.getAttribute('cx'));
                            SizeBorder.startPoint.oppX = TransformManager.changeDocXToSvgX(this.points[this.getOppositionIndex(currentPointIndexInfo)].getAttribute('cx'));
                            SizeBorder.startPoint.y = TransformManager.changeDocYToSvgY(+e.target.getAttribute('cy'));
                            SizeBorder.startPoint.oppY = TransformManager.changeDocYToSvgY(this.points[this.getOppositionIndex(currentPointIndexInfo)].getAttribute('cy'));
                            SizeBorder.startPoint.id = e.target.id;
                            SizeBorder.startPoint.target = {
                                x: this.target.x,
                                y: this.target.y,
                                width: this.target.width,
                                height: this.target.height
                            }

                            EventController.mouseMoveHandler = (e) => {
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

                            EventController.mouseUpHandler = (e) => {
                                e.stopPropagation();
                                this.adjustOverflowInfo();

                                this.renderEdge({x: this.x, y:this.y, width:this.width, height: this.height});
                                this.renderTarget();
                                if(!this.isEqualTarget(SizeBorder.startPoint.target)) {
                                    HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY, type:`${this.target.type}` });
                                }
                                this.refocusThisBorder();
                                SizeBorder.startPoint = {};
                                EventController.mouseMoveHandler = null;
                                EventController.mouseUpHandler = null;
                            }
                        }
                    }
                });

                point.elem.setAttribute('r','5');
                point.elem.setAttribute('cx',this.x + this.ratios[j] * this.width);
                point.elem.setAttribute('cy',this.y + this.ratios[i] * this.height);
                point.elem.setAttribute('fill',COLOR.ORANGE);
                point.elem.setAttribute('cursor','grab');
                point.elem.setAttribute('data-index',this.points.length);
                this.points.push(point.elem);
            }
        }
    }

    renderEdge({ x, y, width, height }){
        let k = 0;
        for(const i in this.ratios){
            for(const j in this.ratios){
                if(i == 1 && j == 1) continue;
                const cx = x + this.ratios[j] * width;
                const cy = y + this.ratios[i] * height;
                this.points[k].setAttribute('cx', cx);
                this.points[k].setAttribute('cy', cy);
                k++;
            }
        }
    }

    mouseDownHandler(e){
        e.stopPropagation();
        SizeBorder.startPoint.x = TransformManager.changeDocXToSvgX(e.pageX);
        SizeBorder.startPoint.y = TransformManager.changeDocYToSvgY(e.pageY);
        this.startPointInit();

        EventController.mouseMoveHandler = (e) => {
            e.stopPropagation();
            const dx = TransformManager.changeDocXToSvgX(e.pageX) - SizeBorder.startPoint.x;
            const dy = TransformManager.changeDocYToSvgY(e.pageY) - SizeBorder.startPoint.y;
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

    renderTarget(){
        this.target.x = this.x;
        this.target.y = this.y;
        this.target.width = this.width;
        this.target.height = this.height;
    }

    detectOverflow(){
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

    adjustOverflowInfo(){
        const innerText = this.target.innerText;
        if(innerText && (isOverflowWidth(innerText.textBox.elem) || isOverflowHeight(innerText.textBox.elem))){
            const adjustInfo = SizeBorder.startPoint.notOverflowInfo || SizeBorder.startPoint.target;
            this.x = adjustInfo.x;
            this.y = adjustInfo.y;
            this.width = adjustInfo.width;
            this.height = adjustInfo.height;
        }
    }

    dbClickHandler(e){
        this.target?.dbClickHandler?.(e);
    }

    deleteHandler() {
        ComponentRepository.removeComponentById(this.target.id);
        HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.DELETE, type: this.target.type });
        ComponentRepository.getComponentById(BOARD_ID).destroyBorder();
    }

    startPointInit(){
        SizeBorder.startPoint.target = {
            x: this.target.x,
            y: this.target.y,
            width: this.target.width,
            height: this.target.height
        }
    }

    isEqualTarget({ x, y, width, height }){
        return (x === undefined ? true : x === this.target.x)
            && (y === undefined ? true :  y === this.target.y)
            && (width === undefined ? true : width === this.target.width)
            && (height === undefined ? true : height === this.target.height) ;
    }

    moveHandler({ dx, dy }){
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

    moveCompleteHandler(){
        if(!this.isEqualTarget(SizeBorder.startPoint.target)) {
            HistoryManager.updateHistoryToLatest({behavior: BEHAVIOR.MOVE, type: `${this.target.type}`});
        }

        SizeBorder.startPoint = {};
        this.renderTarget();
    }
}