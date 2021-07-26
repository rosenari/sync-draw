import Polygon from '../index';
import TransformManager from '../../../../service/TransformManager';

class GJudgment extends Polygon{

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });
    }

    render(){
        const topX = this.x + +(this.width * 0.5).toFixed(0);
        const topY = this.y;
        const rightX = this.x + this.width;
        const rightY = this.y + +(this.height * 0.5).toFixed(0);
        const bottomX = topX;
        const bottomY = this.y + this.height;
        const leftX = this.x;
        const leftY = rightY;
        this.elem.setAttribute('points',`${topX},${topY} ${rightX},${rightY} ${bottomX},${bottomY} ${leftX},${leftY}`);
    }

    get x() {
        return super.x;
    }

    set x(value) {
        super.x = value;
    }

    get y() {
        return super.y;
    }

    set y(value) {
        super.y = value;
    }

    get width() {
        return super.width;
    }

    set width(value) {
        super.width = value;
    }

    get height() {
        return super.height;
    }

    set height(value) {
        super.height = value;
    }

}

export default TransformManager.wrapShape(GJudgment);