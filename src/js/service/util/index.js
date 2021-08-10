import ComponentRepository from '../ComponentRepository';
import {RANDOM_MAX} from '../constant';

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

    shape.setProperty(obj);

    return shape;
}


async function changeTypeStringToClass(type){
    const classPath = type.join('/');
    const classObj = await import('../../component/'+ classPath + '/index.js');
    return classObj.default;
}