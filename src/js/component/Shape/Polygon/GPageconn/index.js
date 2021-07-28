import Polygon from '../index';

export default class GPageconn extends Polygon{

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });
    }

    render(){
        const topLeftX = this.x;
        const topLeftY = this.y;
        const topRightX = this.x + this.width;
        const topRightY = this.y;
        const midRightX = topRightX;
        const midRightY = this.y + +(this.height * 0.75).toFixed(2);
        const bottomX = this.x + +(this.width * 0.5).toFixed(2);
        const bottomY = this.y + this.height;
        const midLeftX = this.x;
        const midLeftY = midRightY;
        this.elem.setAttribute('points',`${topLeftX},${topLeftY} ${topRightX},${topRightY} ${midRightX},${midRightY} 
        ${bottomX},${bottomY} ${midLeftX},${midLeftY}`);
    }
}