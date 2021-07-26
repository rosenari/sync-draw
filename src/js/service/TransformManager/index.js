import ComponentRepository from '../ComponentRepository';

let Instance = null;
export default class TransformManager {
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

    static get translateX(){
        return TransformManager.getInstance().translateX;
    }

    get translateX() {
        return this._translateX;
    }

    static set translateX(value){
        TransformManager.getInstance().translateX = value;
    }

    set translateX(value) {
        this._translateX = +value.toFixed(0);
        this.adjustTransformToShapeGroup();
    }

    static get translateY(){
        return TransformManager.getInstance().translateY;
    }

    get translateY() {
        return this._translateY;
    }

    static set translateY(value){
        TransformManager.getInstance().translateY = value;
    }

    set translateY(value) {
        this._translateY = +value.toFixed(0);
        this.adjustTransformToShapeGroup();
    }

    static get scale(){
        return TransformManager.getInstance().scale;
    }

    get scale() {
        return this._scale;
    }

    static set scale(value){
        TransformManager.getInstance().scale = value;
    }

    set scale(value) {
        this._scale = value;
        this.adjustTransformToShapeGroup();
    }

    static changeSvgXToDocX(svgX){
        return TransformManager.getInstance().changeSvgXToDocX(svgX);
    }

    changeSvgXToDocX(svgX){
        return +(svgX * this.scale).toFixed(0) + this.translateX;
    }

    static changeDocXToSvgX(docX){
        return TransformManager.getInstance().changeDocXToSvgX(docX);
    }

    changeDocXToSvgX(docX){
        return +((docX - this.translateX) / this.scale).toFixed(0);
    }

    static changeSvgYToDocY(svgY){
        return TransformManager.getInstance().changeSvgYToDocY(svgY);
    }

    changeSvgYToDocY(svgY){
        return +(svgY * this.scale).toFixed(0) + this.translateY;
    }

    static changeDocYToSvgY(docY){
        return TransformManager.getInstance().changeDocYToSvgY(docY);
    }

    changeDocYToSvgY(docY){
        return +((docY - this.translateY) / this.scale).toFixed(0);
    }

    static changeSvgWidthToDocWidth(svgWidth){
        return TransformManager.getInstance().changeSvgWidthToDocWidth(svgWidth);
    }

    changeSvgWidthToDocWidth(svgWidth){
        return +(svgWidth * this.scale).toFixed(0);
    }

    static changeDocWidthToSvgWidth(docWidth){
        return TransformManager.getInstance().changeDocWidthToSvgWidth(docWidth);
    }

    changeDocWidthToSvgWidth(docWidth){
        return +(docWidth / this.scale).toFixed(0);
    }

    static changeSvgHeightToDocHeight(svgHeight){
        return TransformManager.getInstance().changeSvgHeightToDocHeight(svgHeight);
    }

    changeSvgHeightToDocHeight(svgHeight){
        return +(svgHeight * this.scale).toFixed(0);
    }

    static changeDocHeightToSvgHeight(docHeight){
        return TransformManager.getInstance().changeDocYToSvgY(docHeight);
    }

    changeDocHeightToSvgHeight(docHeight){
        return +(docHeight / this.scale).toFixed(0);
    }

    static wrapShape(shape){
        return TransformManager.getInstance().wrapShape(shape);
    }

    wrapShape(shape){
        return class extends shape {
            constructor(args) {
                super(args);
            }

            get x() {
                return super.x ;
            }

            set x(value) {
                super.x = +((value - TransformManager.translateX) / TransformManager.scale).toFixed(0);
            }

            get y() {
                return super.y;
            }

            set y(value) {
                super.y = +((value - TransformManager.translateY) / TransformManager.scale).toFixed(0);
            }

            get width(){
                return super.width;
            }

            set width(value) {
                super.width = +(value / TransformManager.scale).toFixed(0);
            }

            get height(){
                return super.height;
            }

            set height(value) {
                super.height = +(value / TransformManager.scale).toFixed(0);
            }
        }
    }
}