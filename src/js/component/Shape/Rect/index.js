import Shape from '../index';

class Rect extends Shape {

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, tagName: 'rect', classList, handlers });
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get x() {
        return +this.elem.getAttribute('x');
    }

    set x(value) {
        this.elem.setAttribute('x', value);
    }

    get y() {
        return +this.elem.getAttribute('y');
    }

    set y(value) {
        this.elem.setAttribute('y', value);
    }

    get width() {
        return +this.elem.getAttribute('width');
    }

    set width(value) {
        this.elem.setAttribute('width', value);
    }

    get height() {
        return +this.elem.getAttribute('height');
    }

    set height(value) {
        this.elem.setAttribute('height', value);
    }
}

export default Rect;