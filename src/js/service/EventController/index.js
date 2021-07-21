import ComponentRepository from '../ComponentRepository';

export default class EventController {
    _rootElem = null;

    constructor(elem){
        this.rootElem = elem;
        this.rootElem.addEventListener('click',this.clickHandler);
        this.rootElem.addEventListener('change',this.changeHandler);
    }

    get rootElem(){
        return this._rootElem;
    }

    set rootElem(value){
        this._rootElem = value;
    }

    clickHandler(e) {
        const target = ComponentRepository.getInstance().getComponentById(e.target.id);
        if(target?.clickHandler) target.clickHandler(e);
    }

    changeHandler(e){
        const target = ComponentRepository.getInstance().getComponentById(e.target.id);
        if(target?.changeHandler) target.changeHandler(e);
    }
}