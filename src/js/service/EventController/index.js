import ComponentRepository from '../ComponentRepository';

export default class EventController {
    rootElem = null;

    constructor(elem){
        this.setRootElem(elem);
        this.getRootElem().addEventListener('click',this.clickHandler);
    }

    setRootElem(elem){
        this.rootElem = elem;
    }

    getRootElem(){
        return this.rootElem;
    }

    clickHandler(e) {
        const target = ComponentRepository.getInstance().getComponentById(e.target.id);
        target.clickHandler(e);
    }
}