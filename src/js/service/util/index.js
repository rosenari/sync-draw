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
    return `${genRandom8Hex()}`;
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