import { Shapes } from '../../component';
import { Service } from '../index';
import {MENU_BAR, RANDOM_MAX} from '../constant';

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
            if(!Service.ComponentRepository.getComponentById(key.id)) sets.delete(key);
        }

        return sets.keys();
    }

    this.set = function(key, value){
        sets.add(key);
        weakmap.set(key, value);
    }

    this.get = function(key){
        if(!Service.ComponentRepository.getComponentById(key.id)){
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

export function deserialize(json){
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

function changeTypeStringToShapeClass(type){
    return Shapes[type];
}

export function setDisablePointerEvent(disable) {
    const menuBar = [ MENU_BAR.PAGE_MENU_BAR_ID,
        MENU_BAR.ITEM_MENU_BAR_ID,
        MENU_BAR.STYLE_MENU_BAR_ID,
        MENU_BAR.HISTORY_MENU_BAR_ID].map(id => Service.ComponentRepository.getComponentById(id));

    if(disable){
        menuBar.forEach(menu => menu.elem.classList.add('disable-pointer-event'));
    } else {
        menuBar.forEach(menu => menu.elem.classList.remove('disable-pointer-event'));
    }
}

export function focusTextRange(elem){
    const range = document.createRange();
    range.selectNodeContents(elem);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}