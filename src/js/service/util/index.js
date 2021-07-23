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