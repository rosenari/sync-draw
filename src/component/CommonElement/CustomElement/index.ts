import { ComponentRepository } from '../../../service';
import { classFor } from '../../../service/util';

export default class CustomElement {
    private _parentId: string = null;
    private _id: string = null;
    private _elem: Element = null;

    constructor({ parentId, id, tagName, content = '', classList = [],
                    xmlns = null, handlers = {} }: {
        parentId: string;
        id: string;
        tagName?: string;
        content?: string;
        classList?: Array<string>;
        xmlns?: string;
        handlers?: {
            [key: string]: any;
        }
    }) {
        this.parentId = parentId;
        this.id = id;

        if(xmlns){
            this.elem = document.createElementNS(xmlns, tagName);
        }else{
            this.elem = document.createElement(tagName);
        }

        if(content){
            this.elem.innerHTML = content;
        }
        if(classList.length > 0){
            this.elem.setAttribute('class', classFor(classList));
        }

        const parent = <CustomElement>ComponentRepository.getComponentById(this.parentId);
        parent.elem.appendChild(this.elem);

        for(const name in handlers){
            this[name] = handlers[name];
        }

        this.elem.setAttribute('id', this.id);
        ComponentRepository.setComponentById(this.id, this);
    }

    public get id(): string{
        return this._id;
    }

    public get elem(): Element {
        return this._elem;
    }

    get parentId(): string {
        return this._parentId;
    }

    public set id(value: string){
        this._id = value;
    }

    public set elem(value: Element) {
        this._elem = value;
    }

    set parentId(value: string) {
        this._parentId = value;
    }
}