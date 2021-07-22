import GraphicElement from '../GraphicElement';
import ComponentRepository from '../../service/ComponentRepository';

export default class Border extends GraphicElement{
    _shape = null;

    constructor({ parentId, id, shape = null }) {
        super({
            parentId,
            id,
            tagName: 'rect'
        });

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.shape = shape;
        this.elem.setAttribute('style','pointer-events: none;');
        this.elem.setAttribute('stroke', 'skyblue');
        this.elem.setAttribute('fill', 'transparent');
        this.elem.setAttribute('stroke-width', '2');

        if(this.shape) this.createShape();
    }

    get x(){
        return +this.elem.getAttribute('x');
    }

    set x(value){
        if(this.shape) {
            this.shape.x = value;
        }
        this.elem.setAttribute('x', value);
    }

    get y(){
        return +this.elem.getAttribute('y');
    }

    set y(value){
        if(this.shape) {
            this.shape.y = value;
        }
        this.elem.setAttribute('y', value);
    }

    get width(){
        return +this.elem.getAttribute('width');
    }

    set width(value){
        if(this.shape) {
            this.shape.width = value;
        }
        this.elem.setAttribute('width', value);
    }

    get height(){
        return +this.elem.getAttribute('height');
    }

    set height(value){
        if(this.shape) {
            this.shape.height = value;
        }
        this.elem.setAttribute('height', value);
    }

    get shape() {
        return this._shape;
    }

    set shape(value) {
        this._shape = value;
    }

    createShape(){
        const repository = ComponentRepository.getInstance();
        const tempGroup = repository.getComponentById(this.parentId);
        tempGroup.appendChild(this.shape.elem);
    }
}