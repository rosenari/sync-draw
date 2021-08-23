import Polygon from '../index';
import { Service } from '../../../../service';
import { COMPONENT_TYPE, RATIO } from '../../../../service/constant';

class GReady extends Polygon {
    static type = COMPONENT_TYPE.GReady;
    type = GReady.type;

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        this.createInnerText('준비');
    }

    render(){
        const topLeftX = this.x + Math.round(this.width * RATIO.PERCENT_25);
        const topLeftY = this.y;
        const topRightX = this.x + Math.round(this.width * RATIO.PERCENT_75);
        const topRightY = this.y;
        const rightX = this.x + this.width;
        const rightY = this.y + Math.round(this.height * RATIO.PERCENT_50);
        const bottomRightX = topRightX;
        const bottomRightY = this.y + this.height;
        const bottomLeftX = topLeftX;
        const bottomLeftY = bottomRightY;
        const leftX = this.x;
        const leftY = rightY;
        this.elem.setAttribute('points',`${topLeftX},${topLeftY} ${topRightX},${topRightY} 
        ${rightX},${rightY} ${bottomRightX},${bottomRightY} ${bottomLeftX},${bottomLeftY} ${leftX},${leftY}`);
    }
}

export default Service.TransformManager.wrapShape(GReady);