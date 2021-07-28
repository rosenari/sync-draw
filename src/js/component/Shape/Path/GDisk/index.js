import Path from '../index';

export default class GDisk extends Path{

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });
    }

    render(){
        const startX = this.x;
        const startY = this.y + +(this.height * 0.1).toFixed(2);
        const curveY_1 = this.y;
        const curveY_2 = this.y + +(this.height * 0.2).toFixed(2);
        const endX = this.x + this.width;
        const endY = this.y + +(this.height * 0.9).toFixed(2);
        const curveY_3 = endY + +(this.height * 0.1).toFixed(2);;
        this.elem.setAttribute('d',`M${startX} ${startY} C${startX} ${curveY_1}, ${endX} ${curveY_1}, ${endX} ${startY} 
        C${endX} ${curveY_2}, ${startX} ${curveY_2}, ${startX} ${startY} 
        V${endY} 
        C${startX} ${curveY_3}, ${endX} ${curveY_3}, ${endX} ${endY}
        V${startY}`);
    }
}