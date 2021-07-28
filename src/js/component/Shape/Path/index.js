import Shape from '../index';

export default class Path extends Shape {
    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, tagName: 'path', classList, handlers });
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get x() {
        return super.x;
    }

    set x(value) {
        super.x = value;
        this.render();
    }

    get y() {
        return super.y;
    }

    set y(value) {
        super.y = value;
        this.render();
    }

    get width() {
        return super.width;
    }

    set width(value) {
        super.width = value;
        this.render();
    }

    get height() {
        return super.height;
    }

    set height(value) {
        super.height = value;
        this.render();
    }
}