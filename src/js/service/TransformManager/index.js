import ComponentRepository from '../ComponentRepository';

let Instance = null;
class TransformManager {
    _moveX = 0;
    _moveY = 0;
    _translateX = 0;
    _translateY = 0;
    _scale = 1;

    constructor() { }

    static getInstance(){
        if(!Instance) Instance = new TransformManager();
        return Instance;
    }

    get shapeGroup(){
        return ComponentRepository.getComponentById('shape-group');
    }

    adjustTransformToShapeGroup() {
        this.shapeGroup.elem.setAttribute('transform',`translate(${this.translateX},${this.translateY}) scale(${this.scale})`);
    }

    get moveX(){
        return this._moveX;
    }

    set moveX(value){
        this._moveX = value;
    }

    get moveY(){
        return this._moveY;
    }

    set moveY(value){
        this._moveY = value;
    }

    get translateX() {
        return this._translateX;
    }

    set translateX(value) {
        this._translateX = +value.toFixed(0);
        this.adjustTransformToShapeGroup();
    }

    get translateY() {
        return this._translateY;
    }

    set translateY(value) {
        this._translateY = +value.toFixed(0);
        this.adjustTransformToShapeGroup();
    }

    get scale() {
        return this._scale;
    }

    set scale(value) {
        this._scale = value;
        this.adjustTransformToShapeGroup();
    }

    changeSvgXToDocX(svgX){
        return +(svgX * this.scale).toFixed(0) + this.translateX;
    }

    changeDocXToSvgX(docX){
        return +((docX - this.translateX) / this.scale).toFixed(0);
    }

    changeSvgYToDocY(svgY){
        return +(svgY * this.scale).toFixed(0) + this.translateY;
    }

    changeDocYToSvgY(docY){
        return +((docY - this.translateY) / this.scale).toFixed(0);
    }

    changeSvgWidthToDocWidth(svgWidth){
        return +(svgWidth * this.scale).toFixed(0);
    }

    changeDocWidthToSvgWidth(docWidth){
        return +(docWidth / this.scale).toFixed(0);
    }

    changeSvgHeightToDocHeight(svgHeight){
        return +(svgHeight * this.scale).toFixed(0);
    }

    changeDocHeightToSvgHeight(docHeight){
        return +(docHeight / this.scale).toFixed(0);
    }

    wrapShape(shape){
        const manager = this;
        return class extends shape {
            constructor(args) {
                super(args);
            }

            get x() {
                return super.x ;
            }

            set x(value) {
                super.x = +((value - manager.translateX) / manager.scale).toFixed(0);
            }

            get y() {
                return super.y;
            }

            set y(value) {
                super.y = +((value - manager.translateY) / manager.scale).toFixed(0);
            }

            get width(){
                return super.width;
            }

            set width(value) {
                super.width = +(value / manager.scale).toFixed(0);
            }

            get height(){
                return super.height;
            }

            set height(value) {
                super.height = +(value / manager.scale).toFixed(0);
            }
        }
    }
}

export default TransformManager.getInstance();