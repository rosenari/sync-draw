import Border from '../Border';
import GraphicElement from '../GraphicElement';
import ComponentRepository from '../../service/ComponentRepository';
import { tinyGUID } from '../../service/util';
import EventController from '../../service/EventController';
import TransformManager from '../../service/TransformManager';

export default class SizeBorder extends Border {
    static startPoint = {};
    _ratios = [0, 0.5 ,1];
    _points = [];
    _target = null;

    constructor({ parentId, target
    }) {
        super({
            parentId,
            id:'size-border'
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

    createEdge(){
        const repository = ComponentRepository.getInstance();
        const tempGroup = repository.getComponentById('temp-group');
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
                           SizeBorder.startPoint.x = TransformManager.changeDocXToSvgX(+e.target.getAttribute('cx'));
                           SizeBorder.startPoint.y = TransformManager.changeDocYToSvgY(+e.target.getAttribute('cy'));
                           SizeBorder.startPoint.id = e.target.id;

                           EventController.mouseMoveHandler = (e) => {
                               e.stopPropagation();
                               const id = SizeBorder.startPoint.id;
                               let dx = TransformManager.changeDocXToSvgX(e.pageX) - SizeBorder.startPoint.x;
                               let dy = TransformManager.changeDocYToSvgY(e.pageY) - SizeBorder.startPoint.y;
                               let width = this.target.width + dx;
                               let height = this.target.height + dy;
                               let x = this.target.x;
                               let y = this.target.y;
                               if(x >= SizeBorder.startPoint.x){
                                   width = this.target.width - dx;
                                   x = this.target.x + dx;
                               }
                               if(y >= SizeBorder.startPoint.y){
                                   height = this.target.height - dy;
                                   y = this.target.y + dy;
                               }

                               if(id === this.points[1].id || id === this.points[6].id){
                                   width = this.target.width;
                               }
                               if(id === this.points[3].id || id === this.points[4].id){
                                   height = this.target.height;
                               }
                               //최소 크기 설정
                               if(width < 50 || height < 50) return;

                               this.x = x;
                               this.y = y;
                               this.width = Math.abs(width);
                               this.height = Math.abs(height);

                               this.renderEdge({x: this.x, y:this.y, width:this.width, height: this.height});
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
                point.elem.setAttribute('fill','orange');
                point.elem.setAttribute('cursor','grab');
                this.points.push(point.elem);
            }
        }
    }

    renderEdge({ x, y, width, height }){
        let k = 0;
        for(const i in this.ratios){
            for(const j in this.ratios){
                if(i==1 && j==1) continue;
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

        EventController.mouseMoveHandler = (e) => {
            e.stopPropagation();
            const dx = TransformManager.changeDocXToSvgX(e.pageX) - SizeBorder.startPoint.x;
            const dy = TransformManager.changeDocYToSvgY(e.pageY) - SizeBorder.startPoint.y;
            let x = this.target.x + dx;
            let y = this.target.y + dy;
            let width = this.target.width;
            let height = this.target.height;

            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;

            this.renderEdge({ x:this.x, y:this.y, width:this.width, height:this.height });
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