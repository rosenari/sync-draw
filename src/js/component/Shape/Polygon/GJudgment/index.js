import Polygon from '../index';
import { Service } from '../../../../service';
import {COMPONENT_TYPE, RATIO} from '../../../../service/constant';

class GJudgment extends Polygon{
    static type = COMPONENT_TYPE.GJudgment;
    type = GJudgment.type;

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        this.createInnerText('판단');
    }

    render(){
        const topX = this.x + Math.round(this.width * RATIO.PERCENT_50);
        const topY = this.y;
        const rightX = this.x + this.width;
        const rightY = this.y + Math.round(this.height * RATIO.PERCENT_50);
        const bottomX = topX;
        const bottomY = this.y + this.height;
        const leftX = this.x;
        const leftY = rightY;
        this.elem.setAttribute('points',`${topX},${topY} ${rightX},${rightY} ${bottomX},${bottomY} ${leftX},${leftY}`);
    }
}

export default Service.TransformManager.wrapShape(GJudgment);