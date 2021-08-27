import * as Components from '../../component';
import { CustomElement, Shape } from '../../component';
import { Line } from '../../component';
import { ComponentRepository } from '../index';
import {COMPONENT_TYPE, MENU_BAR, RANDOM_MAX} from '../constant';
import { PointInfo } from '../../component/Shape/Line';

export type Constructor<T = Shape> = new (...args: Array<any>) => T;
export type ColorCode = string;
export type FontSize = string;

export function add(x: number, y: number): number{
    return x + y;
}

export function debounce(func, time): (...args: any[]) => void {
    let id = null;

    return function (...args): void {
        if (id) clearTimeout(id);

        id = setTimeout(() => {
            func.call(this, ...args);
        }, time);
    }
}

export function classFor(classList: Array<string>): string {
    if(!Array.isArray(classList)){
        throw new Error(`${classList} is not Array`);
    }
    return classList.join(' ');
}

function genRandom8Hex(): string{
    return Math.floor((Math.random() + 1) * RANDOM_MAX)
        .toString(16);
}

export function tinyGUID(): string{
    return `SD-${genRandom8Hex()}`;
}

export function isOverflowWidth(elem: Element): boolean{
    return elem.scrollWidth > elem.clientWidth;
}

export function getOverflowWidth(elem: Element): number{
    return elem.scrollWidth - elem.clientWidth;
}

export function isOverflowHeight(elem: Element): boolean{
    return elem.scrollHeight > elem.clientHeight;
}

export function getOverflowHeight(elem: Element): number{
    return elem.scrollHeight - elem.clientHeight;
}
export class IterableWeakMap{
    private sets: Set<Line> = new Set<Line>();
    private weakmap: WeakMap<Line, PointInfo> = new WeakMap();

    constructor() {}

    public keys(): IterableIterator<any> {
        this.sets.forEach(line => {
            if(!ComponentRepository.getComponentById(line.id)) this.sets.delete(line);
        })

        return this.sets.keys();
    }

    public set(key: Line, value: PointInfo): void {
        this.sets.add(key);
        this.weakmap.set(key, value);
    }

    public get(key: Line): PointInfo{
        if(!ComponentRepository.getComponentById(key.id)){
            this.sets.delete(key);
            return null;
        }
        return this.weakmap.get(key);
    }

    public delete(key: Line): boolean {
        this.sets.delete(key);

        return this.weakmap.delete(key);
    }
}

export function rgbToHex(rgb){
    const result = rgb.replace(/[^,\d]/g,'').split(',');
    return '#' + result.map(code => {
        const hex = Number(code).toString(16);
        return (hex.length === 1 ? '0' + hex : hex).toUpperCase();
    }).join('');
}

export function deserialize(json: string): Shape{
    const obj = JSON.parse(json);
    const classType = changeTypeStringToShapeClass(obj.type);
    const shape = new classType({
        id: obj.id,
        parentId: obj.parentId,
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
    });

    shape.setProperty(obj);

    return shape;
}

function changeTypeStringToShapeClass(type: string): Constructor{
    return Components[type];
}

export function setDisablePointerEvent(disable): void {
    const menuBar = [ MENU_BAR.PAGE_MENU_BAR_ID,
        MENU_BAR.ITEM_MENU_BAR_ID,
        MENU_BAR.STYLE_MENU_BAR_ID,
        MENU_BAR.HISTORY_MENU_BAR_ID].map(id => ComponentRepository.getComponentById(id));

    if(disable){
        menuBar.forEach(menu => (<CustomElement>menu).elem.classList.add('disable-pointer-event'));
    } else {
        menuBar.forEach(menu => (<CustomElement>menu).elem.classList.remove('disable-pointer-event'));
    }
}

export function focusTextRange(elem: Element): void{
    const range = document.createRange();
    range.selectNodeContents(elem);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

export function lineFirstSort(elements: Array<string>): void {
    elements.sort((A, B) => {
        const svgA = JSON.parse(A);
        const svgB = JSON.parse(B);
        if(svgA.type !== COMPONENT_TYPE.GLine && svgB.type === COMPONENT_TYPE.GLine) {
            return 1;
        } else if(svgA.type === COMPONENT_TYPE.GLine && svgB.type !== COMPONENT_TYPE.GLine){
            return -1;
        }
        return 0;
    });
}