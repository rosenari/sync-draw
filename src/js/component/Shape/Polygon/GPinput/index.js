import Polygon from '../index';
import TransformManager from '../../../../service/TransformManager';
import {COMPONENT_TYPE, RATIO} from '../../../../service/constant';

class GPinput extends Polygon{
    static type = COMPONENT_TYPE.GPinput;
    type = GPinput.type;

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        this.createInnerText('수동입력');
    }

    render(){
        const leftTopX = this.x;
        const leftTopY = this.y + Math.round(this.height * RATIO.PERCENT_15);
        const rightTopX = this.x + this.width;
        const rightTopY = this.y;
        const rightBottomX = rightTopX;
        const rightBottomY = this.y + this.height;
        const leftBottomX = this.x;
        const leftBottomY = rightBottomY;
        this.elem.setAttribute('points',`${leftTopX},${leftTopY} ${rightTopX},${rightTopY} ${rightBottomX},${rightBottomY} ${leftBottomX},${leftBottomY}`);
    }
}

export default TransformManager.wrapShape(GPinput);