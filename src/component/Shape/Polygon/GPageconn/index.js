import Polygon from '../index';
import { Service } from '../../../../service';
import {COMPONENT_TYPE, RATIO} from '../../../../service/constant';

class GPageconn extends Polygon{
    static type = COMPONENT_TYPE.GPageconn;
    type = GPageconn.type;

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        this.createInnerText('페이지연결자');
    }

    render(){
        const topLeftX = this.x;
        const topLeftY = this.y;
        const topRightX = this.x + this.width;
        const topRightY = this.y;
        const midRightX = topRightX;
        const midRightY = this.y + Math.round(this.height * RATIO.PERCENT_75);
        const bottomX = this.x + Math.round(this.width * RATIO.PERCENT_50);
        const bottomY = this.y + this.height;
        const midLeftX = this.x;
        const midLeftY = midRightY;
        this.elem.setAttribute('points',`${topLeftX},${topLeftY} ${topRightX},${topRightY} ${midRightX},${midRightY} 
        ${bottomX},${bottomY} ${midLeftX},${midLeftY}`);
    }
}

export default Service.TransformManager.wrapShape(GPageconn);