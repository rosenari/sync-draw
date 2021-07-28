import GraphicElement from '../GraphicElement';
import {COLOR_KAKAO, COLOR_ORANGE} from '../../service/constant';

export default class Border extends GraphicElement{
    _shape = null;
    _x = 0;
    _y = 0;
    _width = 0;
    _height = 0;

    constructor({ parentId, id, shape = null }) {
        super({
            parentId,
            id,
            tagName: 'polyline'
        });
        this.shape = shape;
        this.elem.setAttribute('style','pointer-events: none;');
        this.elem.setAttribute('stroke', COLOR_KAKAO);
        this.elem.setAttribute('fill', 'none');
        this.elem.setAttribute('stroke-width', '2');

        if(this.shape){
            this.shape.elem.setAttribute('stroke',COLOR_ORANGE);
            this.shape.elem.setAttribute('stroke-width','3');
            this.shape.elem.setAttribute('stroke-dasharray','6');
        }
    }

    render() {
        const startX = this.x;
        const startY = this.y;
        const endX = startX + this.width;
        const endY = startY + this.height;
        this.elem.setAttribute('points',`${startX},${startY} ${endX},${startY} ${endX},${endY} ${startX},${endY} ${startX},${startY}`);
    }

    get x() {
        return this._x;
    }

    set x(value) {
        if(this.shape) {
            this.shape.x = value;
        }
        this._x = value;
        this.render();
    }

    get y() {
        return this._y;
    }

    set y(value) {
        if(this.shape) {
            this.shape.y = value;
        }
        this._y = value;
        this.render();
    }

    get width() {
        return this._width;
    }

    set width(value) {
        if(this.shape) {
            this.shape.width = value;
        }
        this._width = value;
        this.render();
    }

    get height() {
        return this._height;
    }

    set height(value) {
        if(this.shape) {
            this.shape.height = value;
        }
        this._height = value;
        this.render();
    }

    get shape() {
        return this._shape;
    }

    set shape(value) {
        this._shape = value;
    }
}