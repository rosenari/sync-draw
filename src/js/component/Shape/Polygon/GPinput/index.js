import Polygon from '../index';
import TransformManager from '../../../../service/TransformManager';

class GPinput extends Polygon{

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });
    }

    render(){
        const leftTopX = this.x;
        const leftTopY = this.y + +(this.height * 0.3).toFixed(2);
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