import Path from '../index';
import TransformManager from '../../../../service/TransformManager';

class GDocument extends Path{

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        if(this.id !== 'placeholder') this.createInnerText('서류');
    }

    render(){
        const startX = this.x;
        const startY = this.y;
        const midX = this.x + Math.round(this.width * 0.5);
        const midY = this.y + Math.round(this.height * 0.8);
        const mmidX = this.x + Math.round(this.width * 0.9);
        const mmidY = this.y + Math.round(this.height * 0.9);
        const endX = this.x + this.width;
        const endY = this.y + this.height;
        this.elem.setAttribute('d',`M${startX} ${startY} H${endX} V${mmidY} Q${mmidX} ${midY}, ${midX} ${mmidY} T ${startX} ${mmidY} V${startY}`);
    }
}

export default TransformManager.wrapShape(GDocument);