import GraphicElement from '../GraphicElement';

export default class Border extends GraphicElement{
    constructor({ parentId, id }) {
        super({
            parentId,
            id,
            tagName: 'rect'
        });
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.elem.setAttribute('style','pointer-events: none;');
        this.elem.setAttribute('stroke', 'skyblue');
        this.elem.setAttribute('fill', 'transparent');
        this.elem.setAttribute('stroke-width', '2');
    }

    get x(){
        return +this.elem.getAttribute('x');
    }

    set x(value){
        this.elem.setAttribute('x', value);
    }

    get y(){
        return +this.elem.getAttribute('y');
    }

    set y(value){
        this.elem.setAttribute('y', value);
    }

    get width(){
        return +this.elem.getAttribute('width');
    }

    set width(value){
        this.elem.setAttribute('width', value);
    }

    get height(){
        return +this.elem.getAttribute('height');
    }

    set height(value){
        this.elem.setAttribute('height', value);
    }
}