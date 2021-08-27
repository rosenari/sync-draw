import Path from '../index';
import { TransformManager } from '../../../../service';
import {COMPONENT_TYPE, RATIO} from '../../../../service/constant';

class GDocument extends Path{
    public static type: string = COMPONENT_TYPE.GDocument;
    public type: string = GDocument.type;

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        this.createInnerText('서류');
    }

    render(){
        const startX = this.x;
        const startY = this.y;
        const midX = this.x + Math.round(this.width * RATIO.PERCENT_50);
        const midY = this.y + Math.round(this.height * RATIO.PERCENT_80);
        const mmidX = this.x + Math.round(this.width * RATIO.PERCENT_90);
        const mmidY = this.y + Math.round(this.height * RATIO.PERCENT_90);
        const endX = this.x + this.width;
        const endY = this.y + this.height;
        this.elem.setAttribute('d',`M${startX} ${startY} H${endX} V${mmidY} Q${mmidX} ${midY}, ${midX} ${mmidY} T ${startX} ${mmidY} V${startY}`);
    }
}

export default TransformManager.wrapShape(GDocument);