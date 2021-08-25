import Path from '../index';
import { Service } from '../../../../service';
import {COMPONENT_TYPE, RATIO} from '../../../../service/constant';

class GDisk extends Path {
    static type = COMPONENT_TYPE.GDisk;
    type = GDisk.type;

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        this.createInnerText('디스크');
    }

    render(){
        const startX = this.x;
        const startY = this.y + Math.round(this.height * RATIO.PERCENT_10);
        const curveY_1 = this.y;
        const curveY_2 = this.y + Math.round(this.height * RATIO.PERCENT_20);
        const endX = this.x + this.width;
        const endY = this.y + Math.round(this.height * RATIO.PERCENT_90);
        const curveY_3 = endY + Math.round(this.height * RATIO.PERCENT_10);
        this.elem.setAttribute('d',`M${startX} ${startY} C${startX} ${curveY_1}, ${endX} ${curveY_1}, ${endX} ${startY} 
        M${startX} ${startY} C${startX} ${curveY_2}, ${endX} ${curveY_2}, ${endX} ${startY}
        M${startX} ${startY} V${endY} 
        C${startX} ${curveY_3}, ${endX} ${curveY_3}, ${endX} ${endY}
        V${startY}
        `);
    }
}

export default Service.TransformManager.wrapShape(GDisk);