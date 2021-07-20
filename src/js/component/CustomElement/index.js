import ComponentRepository from '../../service/ComponentRepository';
import { classFor } from '../../service/util';

export default class CustomElement {
    parentId = null;
    id = null;
    elem = null;

    constructor({ parentId, id, tagName, content = '', classList,
                    xmlns = null }) {
        this.setParentId(parentId);
        this.setId(id);

        if(xmlns) this.setElem(document.createElementNS(xmlns, tagName));
        else this.setElem(document.createElement(tagName));

        this.getElem().innerText = content;
        if(classList.length > 0) this.getElem().setAttribute('class', classFor(classList));

        const parent = ComponentRepository.getInstance().getComponentById(this.getParentId());
        parent.getElem().appendChild(this.getElem());

        this.getElem().setAttribute('id', this.getId());
        ComponentRepository.getInstance().setComponentById(this.getId(), this);
    }

    getParentId() {
        return this.parentId;
    }

    setParentId(id) {
        this.parentId = id;
    }

    getId(){
        return this.id;
    }

    setId(id){
        this.id = id;
    }

    getElem() {
        return this.elem;
    }

    setElem(elem) {
        this.elem = elem;
    }
}