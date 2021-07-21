import ComponentRepository from '../ComponentRepository';

export default class EventController {
    _rootElem = null;

    constructor(elem){
        this.rootElem = elem;
        this.rootElem.addEventListener('click',this.clickHandler);
        this.rootElem.addEventListener('change',this.changeHandler);
        this.rootElem.addEventListener('dblclick',this.dbClickHandler);
        this.rootElem.addEventListener('mousedown',this.mouseDownHandler);
        this.rootElem.addEventListener('mousemove',this.mouseMoveHandler);
        this.rootElem.addEventListener('mouseup',this.mouseUpHandler);
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

    dbClickHandler(e) {
        const target = ComponentRepository.getInstance().getComponentById(e.target.id);
        if(target?.dbClickHandler) target.dbClickHandler(e);
    }

    mouseDownHandler(e) {
        const target = ComponentRepository.getInstance().getComponentById(e.target.id);
        if(target?.mouseDownHandler) target.mouseDownHandler(e);
    }

    mouseMoveHandler(e){
        const target = ComponentRepository.getInstance().getComponentById(e.target.id);
        if(target?.mouseMoveHandler) target.mouseMoveHandler(e);
    }

    mouseUpHandler(e) {
        const target = ComponentRepository.getInstance().getComponentById(e.target.id);
        if(target?.mouseUpHandler) target.mouseUpHandler(e);
    }
}