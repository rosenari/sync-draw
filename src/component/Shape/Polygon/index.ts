import Shape from '../index';

export default class Polygon extends Shape {

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, tagName: 'polygon', classList, handlers });
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render() {}

    get x() {
        return this.getX();
    }

    public getX(){
        return super.getX();
    }

    set x(value) {
        this.setX(value);
    }

    public setX(value){
        super.setX(value);
        this.render();
    }

    get y() {
        return this.getY();
    }

    getY(){
        return super.getY();
    }

    set y(value) {
        this.setY(value);
    }

    setY(value){
        super.setY(value);
        this.render();
    }

    get width() {
        return this.getWidth();
    }

    getWidth(): number {
        return super.getWidth();
    }

    set width(value) {
        this.setWidth(value);
    }

    setWidth(value: number) {
        super.setWidth(value);
        this.render();
    }

    get height() {
        return this.getHeight();
    }

    getHeight(): number {
        return super.getHeight();
    }

    set height(value) {
        this.setHeight(value);
    }

    setHeight(value: number) {
        super.setHeight(value);
        this.render();
    }
}