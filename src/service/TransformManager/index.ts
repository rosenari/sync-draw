import {Group, Line, Shape} from '../../component';
import { ComponentRepository } from '../index';
import { GROUP } from '../constant';
import { Constructor } from '../util';

let Instance: TransformManager;
class TransformManager {
    _moveX = 0;
    _moveY = 0;
    _translateX = 0;
    _translateY = 0;
    _scale = 1;

    constructor() { }

    public static getInstance(): TransformManager{
        if(!Instance) Instance = new TransformManager();
        return Instance;
    }

    public adjustTransformToShapeGroup(shapeGroup:Group = <Group>ComponentRepository.getComponentById(GROUP.SHAPE_GROUP_ID)) {
        shapeGroup.elem.setAttribute('transform',`translate(${this.translateX},${this.translateY}) scale(${this.scale})`);
    }

    public get moveX(): number{
        return this._moveX;
    }

    public set moveX(value: number){
        this._moveX = value;
    }

    public get moveY(): number{
        return this._moveY;
    }

    public set moveY(value: number){
        this._moveY = value;
    }

    public get translateX(): number {
        return this._translateX;
    }

    public set translateX(value: number) {
        this._translateX = Math.round(value);
        this.adjustTransformToShapeGroup();
    }

    public get translateY(): number {
        return this._translateY;
    }

    public set translateY(value: number) {
        this._translateY = Math.round(value);
        this.adjustTransformToShapeGroup();
    }

    public get scale(): number {
        return this._scale;
    }

    public set scale(value: number) {
        this._scale = value;
        this.adjustTransformToShapeGroup();
    }

    public changeSvgXToDocX(svgX: number): number{
        return Math.round(svgX * this.scale) + this.translateX;
    }

    public changeDocXToSvgX(docX: number): number{
        return Math.round((docX - this.translateX) / this.scale);
    }

    public changeSvgYToDocY(svgY: number): number{
        return Math.round(svgY * this.scale) + this.translateY;
    }

    public changeDocYToSvgY(docY: number): number{
        return Math.round((docY - this.translateY) / this.scale);
    }

    public changeSvgWidthToDocWidth(svgWidth: number): number{
        return Math.round(svgWidth * this.scale);
    }

    public changeDocWidthToSvgWidth(docWidth: number): number{
        return Math.round(docWidth / this.scale);
    }

    public changeSvgHeightToDocHeight(svgHeight: number): number{
        return Math.round(svgHeight * this.scale);
    }

    public changeDocHeightToSvgHeight(docHeight: number): number{
        return Math.round(docHeight / this.scale);
    }

    public wrapShape<T extends Constructor>(parentClass: T): T {
        const manager = this;
        return class extends parentClass {
            constructor(...args: Array<any>) {
                super(...args);
            }

            get x(): number {
                return super.getX() ;
            }

            set x(value: number) {
                this.setX(Math.round((value - manager.translateX) / manager.scale));
            }

            get y(): number {
                return super.getY();
            }

            set y(value: number) {
                this.setY(Math.round((value - manager.translateY) / manager.scale));
            }

            get width(){
                return this.getWidth();
            }

            set width(value) {
                this.setWidth(Math.round(value / manager.scale));
            }

            get height(){
                return this.getHeight();
            }

            set height(value) {
                this.setHeight( Math.round(value / manager.scale));
            }
        }
    }

    public wrapLine<T extends Constructor<Line>>(parentClass: T): T {
        const manager = this;
        return class extends parentClass {
            constructor(...args: Array<any>) {
                super(...args);
            }

            addPoint({ x, y }: {
                x: number;
                y: number;
            }): void {
                super.addPoint({
                    x: Math.round((x - manager.translateX) / manager.scale),
                    y: Math.round((y - manager.translateY) / manager.scale)
                })
            }
        }
    }
}

export default TransformManager.getInstance();