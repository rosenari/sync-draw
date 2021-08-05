import Path from '../index';
import TransformManager from '../../../../service/TransformManager';

class GDocument extends Path{

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });
    }

    render(){
        const startX = this.x;
        const startY = this.y;
        const midX = this.x + +(this.width * 0.5).toFixed(2);
        const midY = this.y + +(this.height * 0.5).toFixed(2);
        const mmidX = this.x + +(this.width * 0.75).toFixed(2);
        const mmidY = this.y + +(this.height * 0.75).toFixed(2);
        const endX = this.x + this.width;
        const endY = this.y + this.height;
        this.elem.setAttribute('d',`M${startX} ${startY} H${endX} V${mmidY} Q${mmidX} ${midY}, ${midX} ${mmidY} T ${startX} ${mmidY} V${startY}`);
    }
}

export default TransformManager.wrapShape(GDocument);