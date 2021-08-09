import {BOARD_ID, PLACE_HOLDER_ID} from "../constant";
import {isSvgElement, serialize} from "../util";

let Instance = null;

class ComponentRepository{

    constructor() { }

    static getInstance(){
        if(!Instance) Instance = new ComponentRepository();
        return Instance;
    }

    getComponentById(id){
        return this[id];
    }

    setComponentById(id,component){
        this[id] = component;
    }

    removeComponentById(id){
        document.getElementById(id)?.remove();
        document.getElementById(`${id}-innerText`)?.remove();
        delete this[id];
    }

    getSvgElements(){
        const elements = [];
        for(const key in this) {
            const component = this.getComponentById(key);
            if(isSvgElement(component)) {
                elements.push(serialize(component));
            }
        }

        return elements;
    }

    removeSvgElements(){
        for(const key in this) {
            const component = this.getComponentById(key);
            if(isSvgElement(component)) {
                this.removeComponentById(component.id);
            }
        }
        this.getComponentById(BOARD_ID).destroyBorder();
    }
}

export default ComponentRepository.getInstance();