let Instance = null;

export default class ComponentRepository{

    constructor() { }

    static getInstance(){
        if(!Instance) Instance = new ComponentRepository();
        return Instance;
    }

    static getComponentById(id){
        return ComponentRepository.getInstance().getComponentById(id);
    }

    getComponentById(id){
        return this[id];
    }

    static setComponentById(id, component){
        ComponentRepository.getInstance().setComponentById(id, component);
    }

    setComponentById(id,component){
        this[id] = component;
    }

    static removeComponentById(id){
        ComponentRepository.getInstance().removeComponentById(id);
    }

    removeComponentById(id){
        delete this[id];
    }
}