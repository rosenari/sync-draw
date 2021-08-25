import { Service } from '../../../service';
import { classFor } from '../../../service/util';

export default class CustomElement {
    _parentId = null;
    _id = null;
    _elem = null;

    constructor({ parentId, id, tagName, content = '', classList = [],
                    xmlns = null, handlers = {} }) {
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

        const parent = Service.ComponentRepository.getComponentById(this.parentId);
        parent.elem.appendChild(this.elem);

        for(const name in handlers){
            this[name] = handlers[name];
        }

        this.elem.setAttribute('id', this.id);
        Service.ComponentRepository.setComponentById(this.id, this);
    }

    get id(){
        return this._id;
    }

    get elem() {
        return this._elem;
    }

    get parentId() {
        return this._parentId;
    }

    set id(value){
        this._id = value;
    }

    set elem(value) {
        this._elem = value;
    }

    set parentId(value) {
        this._parentId = value;
    }
}