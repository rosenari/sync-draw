import Shape from '../index';
import { COMPONENT_TYPE } from '../../../service/constant';

class Rect extends Shape {
    public static type: string = COMPONENT_TYPE.Rect;
    public type: string = Rect.type;

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, tagName: 'rect', classList, handlers });
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get x() {
        return this.getX();
    }

    public getX(): number{
        return +this.elem.getAttribute('x');
    }

    set x(value) {
        this.setX(value);
    }

    public setX(value) {
        super.setX(value);
        this.elem.setAttribute('x', value.toString());
    }

    get y() {
        return this.getY();
    }

    public getY(): number{
        return +this.elem.getAttribute('y');
    }

    set y(value) {
        this.setY(value);
    }

    public setY(value){
        super.setY(value);
        this.elem.setAttribute('y', value.toString());
    }

    get width() {
        return this.getWidth();
    }

    getWidth(): number {
        return +this.elem.getAttribute('width');
    }

    set width(value) {
        this.setWidth(value);
    }

    setWidth(value: number) {
        super.setWidth(value);
        this.elem.setAttribute('width', value.toString());
    }

    get height() {
        return this.getWidth();
    }

    getHeight(): number {
        return +this.elem.getAttribute('height');
    }

    set height(value) {
        this.setHeight(value);
    }

    setHeight(value: number) {
        super.setHeight(value);
        this.elem.setAttribute('height', value.toString());
    }
}

export default Rect;