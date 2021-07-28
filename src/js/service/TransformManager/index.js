import ComponentRepository from '../ComponentRepository';
import { SHAPE_GROUP_ID } from '../constant';

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
        return ComponentRepository.getComponentById(SHAPE_GROUP_ID);
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
        this._translateX = Math.round(value);
        this.adjustTransformToShapeGroup();
    }

    get translateY() {
        return this._translateY;
    }

    set translateY(value) {
        this._translateY = Math.round(value);
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
        return Math.round(svgX * this.scale) + this.translateX;
    }

    changeDocXToSvgX(docX){
        return Math.round((docX - this.translateX) / this.scale);
    }

    changeSvgYToDocY(svgY){
        return Math.round(svgY * this.scale) + this.translateY;
    }

    changeDocYToSvgY(docY){
        return Math.round((docY - this.translateY) / this.scale);
    }

    changeSvgWidthToDocWidth(svgWidth){
        return Math.round(svgWidth * this.scale);
    }

    changeDocWidthToSvgWidth(docWidth){
        return Math.round(docWidth / this.scale);
    }

    changeSvgHeightToDocHeight(svgHeight){
        return Math.round(svgHeight * this.scale);
    }

    changeDocHeightToSvgHeight(docHeight){
        return Math.round(docHeight / this.scale);
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
                super.x = Math.round((value - manager.translateX) / manager.scale);
            }

            get y() {
                return super.y;
            }

            set y(value) {
                super.y = Math.round((value - manager.translateY) / manager.scale);
            }

            get width(){
                return super.width;
            }

            set width(value) {
                super.width = Math.round(value / manager.scale);
            }

            get height(){
                return super.height;
            }

            set height(value) {
                super.height = Math.round(value / manager.scale);
            }
        }
    }
}

export default TransformManager.getInstance();