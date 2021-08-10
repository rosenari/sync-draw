import ComponentRepository from '../ComponentRepository';
import {PLACE_HOLDER_ID, RANDOM_MAX} from '../constant';
import GText from "../../component/GText";
import Line from "../../component/Shape/Line";
import Shape from "../../component/Shape";

export function add(x, y){
    return x + y;
}

export function debounce(func, time) {
    let id = null;

    return function (...args) {
        if (id) clearTimeout(id);

        id = setTimeout(() => {
            func.call(this, ...args);
        }, time);
    }
}

export function classFor(classList) {
    if(!Array.isArray(classList)){
        throw new Error(`${classList} is not Array`);
    }
    return classList.join(' ');
}

function genRandom8Hex(){
    return Math.floor((Math.random() + 1) * RANDOM_MAX)
        .toString(16);
}

export function tinyGUID(){
    return `SD-${genRandom8Hex()}`;
}

export function isOverflowWidth(elem){
    return elem.scrollWidth > elem.clientWidth;
}

export function getOverflowWidth(elem){
    return elem.scrollWidth - elem.clientWidth;
}

export function isOverflowHeight(elem){
    return elem.scrollHeight > elem.clientHeight;
}

export function getOverflowHeight(elem){
    return elem.scrollHeight - elem.clientHeight;
}

export function IterableWeakMap(){
    const sets = new Set();
    const weakmap = new WeakMap();

    this.keys = function(){
        for(const key of sets.keys()){
            if(!ComponentRepository.getComponentById(key.id)) sets.delete(key);
        }

        return sets.keys();
    }

    this.set = function(key, value){
        sets.add(key);
        weakmap.set(key, value);
    }

    this.get = function(key){
        if(!ComponentRepository.getComponentById(key.id)){
            sets.delete(key);
            return null;
        }
        return weakmap.get(key);
    }

    this.delete = function(key){
        sets.delete(key);

        return weakmap.delete(key);
    }

    return this;
}

export function rgbToHex(rgb){
    const result = rgb.replace(/[^,\d]/g,'').split(',');
    return '#' + result.map(code => {
        const hex = Number(code).toString(16);
        return (hex.length === 1 ? '0' + hex : hex).toUpperCase();
    }).join('');
}

export function isSvgElement(element){
    return (element instanceof Line || element instanceof Shape || element instanceof GText) && element.id !== PLACE_HOLDER_ID;
}

export function serialize(shape){
    let type = null;
    let text = null;

    //흠.. ㅋㅋㅋ
    if(shape instanceof Line){
        type = ['Shape','Line', shape.__proto__.constructor.name];
    }else if(shape instanceof Shape){
        type = ['Shape',
            shape.__proto__.__proto__.__proto__.constructor.name,
            shape.__proto__.__proto__.constructor.name];
        text = shape.innerText.textBox.elem.innerText;
    }else if(shape instanceof GText){
        type = [shape.__proto__.__proto__.constructor.name];
        text = shape.textBox.elem.innerText;
    }else{
        return null;
    }

    return JSON.stringify({
        type,
        id: shape.id,
        parentId: shape.parentId,
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
        linkedLineIds: Array.from(shape.linkedLine?.keys?.() || [])?.map?.(line => {
            return {
                id:line.id,
                pointInfo: shape.linkedLine.get(line)
            }
        }),
        points: shape.points,
        text,
        fontSize: shape.fontSize,
        fontColor: shape.fontColor,
        fill: shape.fill,
        strokeColor: shape.strokeColor
    });
}

export async function deserialize(json){
    const obj = JSON.parse(json);
    const classType = await changeTypeStringToClass(obj.type);
    const shape = new classType({
        id: obj.id,
        parentId: obj.parentId,
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
    });

    if(obj.linkedLineIds){
        obj.linkedLineIds?.forEach(({id, pointInfo}) => shape?.addLinkedLine?.({ line: ComponentRepository.getComponentById(id), pointInfo }));
    }
    if(obj.points) shape.points = obj.points;
    if(obj.text && shape.innerText) shape.innerText.textBox.elem.innerText = obj.text;
    if(obj.text && shape.textBox) shape.textBox.elem.innerText = obj.text;
    if(obj.fontSize) shape.fontSize = obj.fontSize;
    if(obj.fontColor) shape.fontColor = obj.fontColor;
    if(obj.fill) shape.fill = obj.fill;
    if(obj.strokeColor) shape.strokeColor = obj.strokeColor;

    return shape;
}


async function changeTypeStringToClass(type){
    const classPath = type.join('/');
    const classObj = await import('../../component/'+ classPath + '/index.js');
    return classObj.default;
}