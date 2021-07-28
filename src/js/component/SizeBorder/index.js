import Border from '../Border';
import GraphicElement from '../GraphicElement';
import ComponentRepository from '../../service/ComponentRepository';
import { tinyGUID } from '../../service/util';
import EventController from '../../service/EventController';
import TransformManager from '../../service/TransformManager';
import {COLOR_ORANGE, SIZE_BORDER_ID, TEMP_GROUP_ID} from '../../service/constant';

export default class SizeBorder extends Border {
    static startPoint = {};
    _ratios = [0, 0.5 ,1];
    _points = [];
    _target = null;

    constructor({ parentId, target
                }) {
        super({
            parentId,
            id: SIZE_BORDER_ID
        });

        this.target = target;
        this.x = this.target.x;
        this.y = this.target.y;
        this.width = this.target.width;
        this.height = this.target.height;
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

    getOppositionIndex({ maxIndex, index }){
        if(index < 0 || index > maxIndex){
            throw new Error(`${index} is wrong input (0 < input <= ${maxIndex})`);
        }

        return maxIndex - index;
    }

    createEdge(){
        const tempGroup = ComponentRepository.getComponentById(TEMP_GROUP_ID);
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

                                //최소 크기 설정
                                //if(width < 50 || height < 50) return;

                                this.x = x;
                                this.y = y;
                                this.width = Math.abs(width);
                                this.height = Math.abs(height);

                                this.renderEdge({x: this.x, y:this.y, width:this.width, height: this.height});
                                this.renderTarget();
                            }

                            EventController.mouseUpHandler = (e) => {
                                e.stopPropagation();
                                SizeBorder.startPoint = {};
                                this.renderTarget();
                                EventController.mouseMoveHandler = null;
                                EventController.mouseUpHandler = null;
                            }
                        }
                    }
                });

                point.elem.setAttribute('r','5');
                point.elem.setAttribute('cx',this.x + this.ratios[j] * this.width);
                point.elem.setAttribute('cy',this.y + this.ratios[i] * this.height);
                point.elem.setAttribute('fill',COLOR_ORANGE);
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
        SizeBorder.startPoint.target = {
            x: this.target.x,
            y: this.target.y,
            width: this.target.width,
            height: this.target.height
        }

        EventController.mouseMoveHandler = (e) => {
            e.stopPropagation();
            const dx = TransformManager.changeDocXToSvgX(e.pageX) - SizeBorder.startPoint.x;
            const dy = TransformManager.changeDocYToSvgY(e.pageY) - SizeBorder.startPoint.y;
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

        EventController.mouseUpHandler = (e) => {
            e.stopPropagation();
            SizeBorder.startPoint = {};
            this.renderTarget();
            EventController.mouseMoveHandler = null;
            EventController.mouseUpHandler = null;
        }
    }

    renderTarget(){
        this.target.x = this.x
        this.target.y = this.y
        this.target.width = this.width
        this.target.height = this.height
    }
}