import ComponentRepository from '../ComponentRepository';

export default class EventController {
    _rootElem = null;

    constructor(elem){
        this.rootElem = elem;
        this.rootElem.addEventListener('click',this.clickHandler);
    }

    get rootElem(){
        return this._rootElem;
    }

    set rootElem(value){
        this._rootElem = value;
    }

    clickHandler(e) {
        const target = ComponentRepository.getInstance().getComponentById(e.target.id);
        target.clickHandler(e);
    }
}