import { KeyboardManager, ComponentRepository } from '../index';
import {
    BlurElement, ClickElement, DBClickElement, InputElement, ChangeElement,
    MouseMoveElement, MouseUpElement, MouseDownElement, KeyUpElement
} from '../../interface';

export default class EventController {
    private _rootElem: HTMLElement = null;

    constructor(elem: HTMLElement) {
        this.rootElem = elem;
        this.rootElem.addEventListener('click',this.clickHandler);
        this.rootElem.addEventListener('change',this.changeHandler);
        this.rootElem.addEventListener('dblclick',this.dbClickHandler);
        this.rootElem.addEventListener('mousedown',this.mouseDownHandler);
        this.rootElem.addEventListener('mousemove',this.mouseMoveHandler);
        this.rootElem.addEventListener('mouseup',this.mouseUpHandler);
        this.rootElem.addEventListener('blur',this.blurHandler, true);
        this.rootElem.addEventListener('keyup',this.keyUpHandler);
        this.rootElem.addEventListener('input',this.inputHandler);

        setTimeout(() => KeyboardManager.eventInit({}));
    }

    public get rootElem(): HTMLElement {
        return this._rootElem;
    }

    public set rootElem(value: HTMLElement) {
        this._rootElem = value;
    }

    protected clickHandler(e: Event) {
        const target = <ClickElement>ComponentRepository.getComponentById((<HTMLElement>e.target).id);
        target?.clickHandler?.(e);
    }

    protected changeHandler(e: Event) {
        const target = <ChangeElement>ComponentRepository.getComponentById((<HTMLElement>e.target).id);
        target?.changeHandler?.(e);
    }

    protected dbClickHandler(e: Event) {
        const target = <DBClickElement>ComponentRepository.getComponentById((<HTMLElement>e.target).id);
        target?.dbClickHandler?.(e);
        EventController.dbClickHandler?.(e);
    }

    public static dbClickHandler = null;

    protected mouseDownHandler(e: Event) {
        const target = <MouseDownElement>ComponentRepository.getComponentById((<HTMLElement>e.target).id);
        target?.mouseDownHandler?.(e);
    }

    protected mouseMoveHandler(e: Event) {
        const target = <MouseMoveElement>ComponentRepository.getComponentById((<HTMLElement>e.target).id);
        target?.mouseMoveHandler?.(e);
        EventController.mouseMoveHandler?.(e);
    }

    public static mouseMoveHandler = null;

    protected mouseUpHandler(e: Event) {
        const target = <MouseUpElement>ComponentRepository.getComponentById((<HTMLElement>e.target).id);
        target?.mouseUpHandler?.(e);
        EventController.mouseUpHandler?.(e);
    }

    public static mouseUpHandler = null;

    protected blurHandler(e: Event) {
        const target = <BlurElement>ComponentRepository.getComponentById((<HTMLElement>e.target).id);
        target?.blurHandler?.(e);
    }

    protected keyUpHandler(e: Event) {
        const target = <KeyUpElement>ComponentRepository.getComponentById((<HTMLElement>e.target).id);
        target?.keyUpHandler?.(e);
    }

    protected inputHandler(e: Event) {
        const target = <InputElement>ComponentRepository.getComponentById((<HTMLElement>e.target).id);
        target.inputHandler?.(e);
    }
}