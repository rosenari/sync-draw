import ComponentRepository from '../ComponentRepository';

export default class EventController {
    _rootElem = null;

    constructor(elem) {
        this.rootElem = elem;
        this.rootElem.addEventListener('click',this.clickHandler);
        this.rootElem.addEventListener('change',this.changeHandler);
        this.rootElem.addEventListener('dblclick',this.dbClickHandler);
        this.rootElem.addEventListener('mousedown',this.mouseDownHandler);
        this.rootElem.addEventListener('mousemove',this.mouseMoveHandler);
        this.rootElem.addEventListener('mouseup',this.mouseUpHandler);
        this.rootElem.addEventListener('blur',this.blurHandler, true);
        this.rootElem.addEventListener('keyup',this.keyUpHandler);
    }

    get rootElem() {
        return this._rootElem;
    }

    set rootElem(value) {
        this._rootElem = value;
    }

    clickHandler(e) {
        const target = ComponentRepository.getComponentById(e.target.id);
        target?.clickHandler?.(e);
    }

    changeHandler(e) {
        const target = ComponentRepository.getComponentById(e.target.id);
        target?.changeHandler?.(e);
    }

    dbClickHandler(e) {
        const target = ComponentRepository.getComponentById(e.target.id);
        target?.dbClickHandler?.(e);
        EventController.dbClickHandler?.(e);
    }

    static dbClickHandler = null;

    mouseDownHandler(e) {
        const target = ComponentRepository.getComponentById(e.target.id);
        target?.mouseDownHandler?.(e);
    }

    mouseMoveHandler(e) {
        const target = ComponentRepository.getComponentById(e.target.id);
        target?.mouseMoveHandler?.(e);
        EventController.mouseMoveHandler?.(e);
    }

    static mouseMoveHandler = null;

    mouseUpHandler(e) {
        const target = ComponentRepository.getComponentById(e.target.id);
        target?.mouseUpHandler?.(e);
        EventController.mouseUpHandler?.(e);
    }

    static mouseUpHandler = null;

    blurHandler(e) {
        const target = ComponentRepository.getComponentById(e.target.id);
        target?.blurHandler?.(e);
    }

    keyUpHandler(e) {
        const target = ComponentRepository.getComponentById(e.target.id);
        target?.keyUpHandler?.(e);
    }
}