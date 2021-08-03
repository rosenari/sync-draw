import Polygon from '../index';
import TransformManager from '../../../../service/TransformManager';
import {RATIO} from '../../../../service/constant';

class GInputoutput extends Polygon{

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        if(this.id !== 'placeholder') this.createInnerText('입출력');
    }

    render(){
        const leftTopX = this.x + Math.round(this.width * RATIO.PERCENT_20);
        const leftTopY = this.y;
        const rightTopX = this.x + this.width;
        const rightTopY = this.y;
        const rightBottomX = this.x + Math.round(this.width * RATIO.PERCENT_80);
        const rightBottomY = this.y + this.height;
        const leftBottomX = this.x;
        const leftBottomY = rightBottomY;
        this.elem.setAttribute('points',`${leftTopX},${leftTopY} ${rightTopX},${rightTopY} ${rightBottomX},${rightBottomY} ${leftBottomX},${leftBottomY}`);
    }
}

export default TransformManager.wrapShape(GInputoutput);