import Polygon from '../index';

export default class GReady extends Polygon {

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });
    }

    render(){
        const topLeftX = this.x + +(this.width * 0.25);
        const topLeftY = this.y;
        const topRightX = this.x + +(this.width * 0.75);
        const topRightY = this.y;
        const rightX = this.x + this.width;
        const rightY = this.y + +(this.height * 0.5);
        const bottomRightX = topRightX;
        const bottomRightY = this.y + this.height;
        const bottomLeftX = topLeftX;
        const bottomLeftY = bottomRightY;
        const leftX = this.x;
        const leftY = rightY;
        this.elem.setAttribute('points',`${topLeftX},${topLeftY} ${topRightX},${topRightY} 
        ${rightX},${rightY} ${bottomRightX},${bottomRightY} ${bottomLeftX},${bottomLeftY} ${leftX},${leftY}`);
    }
}