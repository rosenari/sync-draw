import Path from '../index';
import TransformManager from '../../../../service/TransformManager';

class GDisk extends Path{

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });
    }

    render(){
        const startX = this.x;
        const startY = this.y + Math.round(this.height * 0.1);
        const curveY_1 = this.y;
        const curveY_2 = this.y + Math.round(this.height * 0.2);
        const endX = this.x + this.width;
        const endY = this.y + Math.round(this.height * 0.9);
        const curveY_3 = endY + Math.round(this.height * 0.1);
        this.elem.setAttribute('d',`M${startX} ${startY} C${startX} ${curveY_1}, ${endX} ${curveY_1}, ${endX} ${startY} 
        C${endX} ${curveY_2}, ${startX} ${curveY_2}, ${startX} ${startY} 
        V${endY} 
        C${startX} ${curveY_3}, ${endX} ${curveY_3}, ${endX} ${endY}
        V${startY}`);
    }
}

export default TransformManager.wrapShape(GDisk);