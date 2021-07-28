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
        delete this[id];
    }
}

export default ComponentRepository.getInstance();