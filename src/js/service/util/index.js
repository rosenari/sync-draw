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

export function isOverflowHeight(elem){
    return elem.scrollHeight > elem.clientHeight;
}

export function getOverflowHeight(elem){
    return elem.scrollHeight - elem.clientHeight;
}