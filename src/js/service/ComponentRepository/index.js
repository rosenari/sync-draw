import {BOARD_ID, PLACE_HOLDER_ID} from "../constant";

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
        delete this[`${id}-innerText`];
        delete this[`${id}-foreignobj`];
        delete this[`${id}-textbox`]
    }

    getSvgElements(){
        const elements = [];
        for(const key in this) {
            const component = this.getComponentById(key);
            if(component?.serialize && component.id !== PLACE_HOLDER_ID) {
                elements.push(component.serialize());
            }
        }

        return elements;
    }

    removeSvgElements(){
        for(const key in this) {
            const component = this.getComponentById(key);
            if(component?.serialize && component.id !== PLACE_HOLDER_ID) {
                this.removeComponentById(component.id);
            }
        }
        this.getComponentById(BOARD_ID).destroyBorder();
    }
}

export default ComponentRepository.getInstance();